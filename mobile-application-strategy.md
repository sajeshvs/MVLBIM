# 📱 Mobile Application Strategy

## Overview
Design a comprehensive mobile strategy that extends MVLBIM's capabilities to field operations, enabling real-time data collection, progress tracking, and decision-making on construction sites. This addresses a key limitation of traditional desktop-bound estimating and project control systems.

## Mobile Strategy Framework

### 1. Multi-Platform Architecture
```yaml
# Mobile Platform Strategy
platform_approach:
  primary: "Progressive Web App (PWA)"
  secondary: "Native iOS/Android"
  
  pwa_capabilities:
    - "Offline-first functionality"
    - "Push notifications"
    - "Camera and file access"
    - "GPS integration"
    - "Background sync"
    - "App-like experience"
  
  native_app_scenarios:
    - "Advanced camera features (AR overlays)"
    - "Complex file management"
    - "Hardware integration (sensors, NFC)"
    - "Performance-critical operations"

# Device Categories & Use Cases
device_categories:
  smartphones:
    primary_users: ["site_supervisors", "quality_inspectors", "safety_officers"]
    use_cases: ["quick_updates", "photo_capture", "issue_reporting", "communication"]
    
  tablets:
    primary_users: ["project_managers", "engineers", "quantity_surveyors"]
    use_cases: ["drawing_review", "quantity_takeoff", "progress_tracking", "reporting"]
    
  rugged_devices:
    primary_users: ["field_engineers", "surveyors"]
    use_cases: ["harsh_environment_work", "precision_measurements", "GPS_tracking"]
```

### 2. Offline-First Architecture
```typescript
// Service Worker for Offline Functionality
class OfflineManager {
  private dbName = 'mvlbim-mobile';
  private version = 1;
  private db: IDBDatabase;
  
  async initialize(): Promise<void> {
    this.db = await this.openIndexedDB();
    await this.setupOfflineStorage();
    this.startSyncManager();
  }
  
  private async openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for offline data
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('lastModified', 'lastModified');
        }
        
        if (!db.objectStoreNames.contains('measurements')) {
          const measurementStore = db.createObjectStore('measurements', { keyPath: 'id' });
          measurementStore.createIndex('projectId', 'projectId');
          measurementStore.createIndex('syncStatus', 'syncStatus');
        }
        
        if (!db.objectStoreNames.contains('photos')) {
          const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
          photoStore.createIndex('measurementId', 'measurementId');
        }
        
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncStore.createIndex('priority', 'priority');
          syncStore.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }
  
  async syncWhenOnline(): Promise<void> {
    if (!navigator.onLine) return;
    
    const pendingSync = await this.getPendingSyncItems();
    
    for (const item of pendingSync) {
      try {
        await this.syncItem(item);
        await this.markItemSynced(item.id);
      } catch (error) {
        await this.handleSyncError(item, error);
      }
    }
  }
  
  private async syncItem(item: SyncItem): Promise<void> {
    switch (item.type) {
      case 'measurement':
        await this.syncMeasurement(item);
        break;
      case 'photo':
        await this.syncPhoto(item);
        break;
      case 'progress_update':
        await this.syncProgressUpdate(item);
        break;
      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  }
}

// Progressive Web App Configuration
const pwaConfig = {
  manifest: {
    name: "MVLBIM Mobile",
    short_name: "MVLBIM",
    description: "Construction Cost Management & Project Control",
    theme_color: "#1E3A8A",
    background_color: "#FFFFFF",
    display: "standalone",
    orientation: "any",
    start_url: "/mobile",
    scope: "/mobile/",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    categories: ["productivity", "business"],
    shortcuts: [
      {
        name: "Quick Measurement",
        short_name: "Measure",
        description: "Start a new quantity measurement",
        url: "/mobile/measure",
        icons: [{ src: "/icons/measure-icon.png", sizes: "96x96" }]
      },
      {
        name: "Progress Update",
        short_name: "Progress",
        description: "Update project progress",
        url: "/mobile/progress",
        icons: [{ src: "/icons/progress-icon.png", sizes: "96x96" }]
      }
    ]
  },
  
  serviceWorker: {
    strategies: {
      documents: 'NetworkFirst',
      images: 'CacheFirst',
      api: 'NetworkFirst',
      static: 'CacheFirst'
    },
    precache: [
      '/mobile/',
      '/mobile/offline.html',
      '/assets/critical.css',
      '/assets/mobile-app.js'
    ]
  }
};
```

## Core Mobile Features

### 1. Field Quantity Take-Off
```typescript
// Mobile Quantity Take-Off Component
interface MobileTakeOffProps {
  drawingId: string;
  boqItemId?: string;
  offline?: boolean;
}

const MobileTakeOff: React.FC<MobileTakeOffProps> = ({
  drawingId,
  boqItemId,
  offline = false
}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentTool, setCurrentTool] = useState<MeasurementTool>('area');
  const [drawingData, setDrawingData] = useState<DrawingData | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  
  useEffect(() => {
    loadDrawingData();
  }, [drawingId]);
  
  const loadDrawingData = async () => {
    if (offline) {
      // Load from IndexedDB
      const data = await OfflineManager.getDrawing(drawingId);
      setDrawingData(data);
    } else {
      // Load from API
      const response = await fetch(`/api/v1/drawings/${drawingId}`);
      const data = await response.json();
      setDrawingData(data);
      
      // Cache for offline use
      await OfflineManager.cacheDrawing(data);
    }
  };
  
  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const newPoint: TouchPoint = {
      x: x / canvas.offsetWidth,
      y: y / canvas.offsetHeight,
      timestamp: Date.now()
    };
    
    setTouchPoints(prev => [...prev, newPoint]);
  };
  
  const handleMeasurementComplete = async () => {
    if (touchPoints.length < 2) return;
    
    const measurement: Measurement = {
      id: generateId(),
      drawingId,
      boqItemId,
      tool: currentTool,
      points: touchPoints,
      area: calculateArea(touchPoints),
      length: calculateLength(touchPoints),
      timestamp: new Date(),
      syncStatus: offline ? 'pending' : 'synced',
      capturedBy: await getCurrentUser()
    };
    
    if (offline) {
      await OfflineManager.saveMeasurement(measurement);
    } else {
      await saveMeasurementToAPI(measurement);
    }
    
    setMeasurements(prev => [...prev, measurement]);
    setTouchPoints([]);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
  return (
    <div className="mobile-takeoff">
      <div className="drawing-container">
        <canvas
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          className="drawing-canvas"
        />
        
        {drawingData && (
          <img
            src={drawingData.url}
            alt="Construction Drawing"
            className="drawing-image"
          />
        )}
        
        <MeasurementOverlay
          points={touchPoints}
          measurements={measurements}
          tool={currentTool}
        />
      </div>
      
      <MobileToolbar
        currentTool={currentTool}
        onToolChange={setCurrentTool}
        onComplete={handleMeasurementComplete}
        onUndo={() => setTouchPoints(prev => prev.slice(0, -1))}
        measurements={measurements}
      />
      
      {offline && (
        <OfflineIndicator
          pendingSync={measurements.filter(m => m.syncStatus === 'pending').length}
        />
      )}
    </div>
  );
};

// Touch-optimized measurement tools
const MobileToolbar: React.FC<MobileToolbarProps> = ({
  currentTool,
  onToolChange,
  onComplete,
  onUndo,
  measurements
}) => {
  return (
    <div className="mobile-toolbar">
      <div className="tool-selector">
        <ToolButton
          tool="area"
          active={currentTool === 'area'}
          onClick={() => onToolChange('area')}
          icon="📐"
          label="Area"
        />
        <ToolButton
          tool="length"
          active={currentTool === 'length'}
          onClick={() => onToolChange('length')}
          icon="📏"
          label="Length"
        />
        <ToolButton
          tool="count"
          active={currentTool === 'count'}
          onClick={() => onToolChange('count')}
          icon="🔢"
          label="Count"
        />
      </div>
      
      <div className="action-buttons">
        <button
          className="btn-undo"
          onClick={onUndo}
          disabled={!touchPoints.length}
        >
          ↶ Undo
        </button>
        
        <button
          className="btn-complete"
          onClick={onComplete}
          disabled={touchPoints.length < 2}
        >
          ✓ Complete
        </button>
      </div>
      
      <div className="measurement-summary">
        <span>{measurements.length} measurements</span>
      </div>
    </div>
  );
};
```

### 2. Progress Tracking & Photo Documentation
```typescript
// Progress Tracking Component
const ProgressTracker: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  
  const captureProgress = async (activityId: string, progress: number) => {
    const photo = await capturePhoto({
      category: 'progress',
      activityId,
      progress,
      location: await getCurrentLocation(),
      timestamp: new Date()
    });
    
    const update: ProgressUpdate = {
      id: generateId(),
      activityId,
      progress,
      photos: [photo.id],
      notes: '',
      timestamp: new Date(),
      updatedBy: await getCurrentUser(),
      syncStatus: navigator.onLine ? 'synced' : 'pending'
    };
    
    if (navigator.onLine) {
      await submitProgressUpdate(update);
    } else {
      await OfflineManager.queueProgressUpdate(update);
    }
  };
  
  return (
    <div className="progress-tracker">
      <ActivityList
        activities={activities}
        onSelect={setSelectedActivity}
      />
      
      {selectedActivity && (
        <ProgressCapture
          activity={selectedActivity}
          onCapture={captureProgress}
        />
      )}
      
      <PhotoGallery
        photos={photos}
        onPhotoSelect={handlePhotoSelect}
      />
    </div>
  );
};

// Camera Integration with Metadata
class CameraService {
  async capturePhoto(options: PhotoCaptureOptions): Promise<ProgressPhoto> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: options.camera || 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });
    
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    // Add metadata overlay
    await this.addMetadataOverlay(canvas, options);
    
    const blob = await this.canvasToBlob(canvas);
    
    // Stop camera
    stream.getTracks().forEach(track => track.stop());
    
    const photo: ProgressPhoto = {
      id: generateId(),
      blob,
      metadata: {
        timestamp: new Date(),
        location: await this.getCurrentLocation(),
        projectId: options.projectId,
        activityId: options.activityId,
        progress: options.progress,
        capturedBy: await getCurrentUser(),
        deviceInfo: this.getDeviceInfo()
      },
      syncStatus: 'pending'
    };
    
    await OfflineManager.savePhoto(photo);
    
    return photo;
  }
  
  private async addMetadataOverlay(
    canvas: HTMLCanvasElement,
    options: PhotoCaptureOptions
  ): Promise<void> {
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Semi-transparent overlay
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, canvas.height - 120, canvas.width, 120);
    
    // Metadata text
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.textAlign = 'left';
    
    const metadata = [
      `Project: ${options.projectName}`,
      `Activity: ${options.activityName}`,
      `Progress: ${options.progress}%`,
      `Date: ${new Date().toLocaleDateString()}`,
      `Location: ${await this.getLocationString()}`
    ];
    
    metadata.forEach((text, index) => {
      context.fillText(text, 20, canvas.height - 100 + (index * 20));
    });
  }
  
  private async getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  }
}
```

### 3. Voice Notes & Dictation
```typescript
// Voice Notes Integration
class VoiceNoteService {
  private recognition: SpeechRecognition | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  
  async startVoiceNote(options: VoiceNoteOptions): Promise<string> {
    const sessionId = generateId();
    
    // Start speech recognition for real-time transcription
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      await this.startSpeechRecognition(sessionId);
    }
    
    // Start audio recording for backup
    await this.startAudioRecording(sessionId);
    
    return sessionId;
  }
  
  private async startSpeechRecognition(sessionId: string): Promise<void> {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    
    this.recognition.onresult = (event) => {
      let transcript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      // Real-time updates
      this.updateTranscript(sessionId, transcript);
    };
    
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    
    this.recognition.start();
  }
  
  async stopVoiceNote(sessionId: string): Promise<VoiceNote> {
    if (this.recognition) {
      this.recognition.stop();
    }
    
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    
    const voiceNote = await this.finalizeVoiceNote(sessionId);
    
    // Save offline
    await OfflineManager.saveVoiceNote(voiceNote);
    
    return voiceNote;
  }
}

// Voice Commands for Hands-Free Operation
class VoiceCommandHandler {
  private commands = new Map<string, VoiceCommand>();
  
  initialize(): void {
    this.registerCommands([
      {
        phrases: ['start measurement', 'begin measuring', 'measure area'],
        action: () => this.startMeasurement(),
        confidence: 0.8
      },
      {
        phrases: ['take photo', 'capture image', 'take picture'],
        action: () => this.capturePhoto(),
        confidence: 0.8
      },
      {
        phrases: ['save progress', 'update progress', 'record progress'],
        action: (params) => this.updateProgress(params),
        confidence: 0.8
      },
      {
        phrases: ['show project', 'open project', 'project overview'],
        action: () => this.showProject(),
        confidence: 0.8
      }
    ]);
  }
  
  private async startMeasurement(): Promise<void> {
    // Navigate to measurement tool
    await this.navigateTo('/mobile/measure');
    
    // Provide audio feedback
    await this.speak('Starting measurement tool');
  }
  
  private async speak(text: string): Promise<void> {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }
}
```

### 4. Augmented Reality Features
```typescript
// AR Overlay for Construction Drawings
class ARDrawingOverlay {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  
  async initializeAR(): Promise<void> {
    // Initialize WebXR
    if ('xr' in navigator) {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['local', 'hit-test'],
        optionalFeatures: ['dom-overlay']
      });
      
      await this.setupARSession(session);
    } else {
      // Fallback to marker-based AR
      await this.setupMarkerAR();
    }
  }
  
  private async setupARSession(session: XRSession): Promise<void> {
    // Set up Three.js scene for AR
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    this.renderer.xr.setSession(session);
    
    // Add drawing overlay
    await this.loadDrawingOverlay();
    
    // Start render loop
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
  }
  
  private async loadDrawingOverlay(): Promise<void> {
    // Load 3D model or 2D overlay of construction drawing
    const drawingData = await this.getCurrentDrawing();
    
    // Create overlay geometry
    const geometry = new THREE.PlaneGeometry(10, 7);
    const texture = new THREE.TextureLoader().load(drawingData.imageUrl);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8
    });
    
    const drawingMesh = new THREE.Mesh(geometry, material);
    drawingMesh.position.set(0, 0, -5);
    
    this.scene.add(drawingMesh);
  }
  
  async addMeasurementMarker(position: THREE.Vector3, measurement: Measurement): Promise<void> {
    // Create 3D marker for measurement
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    marker.position.copy(position);
    this.scene.add(marker);
    
    // Add text label
    const labelTexture = this.createTextTexture(measurement.value.toString());
    const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
    const label = new THREE.Sprite(labelMaterial);
    
    label.position.set(position.x, position.y + 0.3, position.z);
    label.scale.set(0.5, 0.25, 1);
    
    this.scene.add(label);
  }
}

// QR Code Integration for Quick Access
class QRCodeService {
  async scanQRCode(): Promise<QRCodeData> {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      const scanFrame = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = this.decodeQRCode(imageData);
        
        if (qrCode) {
          stream.getTracks().forEach(track => track.stop());
          resolve(qrCode);
        } else {
          requestAnimationFrame(scanFrame);
        }
      };
      
      scanFrame();
    });
  }
  
  async handleQRCodeScan(data: QRCodeData): Promise<void> {
    switch (data.type) {
      case 'project':
        await this.openProject(data.projectId);
        break;
      case 'drawing':
        await this.openDrawing(data.drawingId);
        break;
      case 'equipment':
        await this.openEquipmentDetails(data.equipmentId);
        break;
      default:
        throw new Error(`Unknown QR code type: ${data.type}`);
    }
  }
}
```

## Device Integration & Hardware Features

### 1. GPS & Location Services
```typescript
// Location-Based Services
class LocationService {
  private watchId: number | null = null;
  private currentLocation: GeolocationPosition | null = null;
  
  async startLocationTracking(): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported');
    }
    
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentLocation = position;
        this.updateLocationData(position);
      },
      (error) => {
        console.error('Location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }
  
  async getWorkSiteDistance(): Promise<number> {
    if (!this.currentLocation) {
      throw new Error('Location not available');
    }
    
    const workSite = await this.getWorkSiteLocation();
    return this.calculateDistance(
      this.currentLocation.coords,
      workSite.coordinates
    );
  }
  
  private calculateDistance(pos1: GeolocationCoordinates, pos2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(pos2.latitude - pos1.latitude);
    const dLon = this.toRad(pos2.longitude - pos1.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(pos1.latitude)) * Math.cos(this.toRad(pos2.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Return distance in meters
  }
}

// Geofencing for Site-Based Features
class GeofencingService {
  private geofences = new Map<string, Geofence>();
  
  async createProjectGeofence(projectId: string, coordinates: Coordinates, radius: number): Promise<void> {
    const geofence: Geofence = {
      id: generateId(),
      projectId,
      center: coordinates,
      radius,
      enabled: true,
      entryActions: ['enable_project_features', 'sync_project_data'],
      exitActions: ['disable_location_features', 'save_offline_data']
    };
    
    this.geofences.set(projectId, geofence);
    await this.saveGeofence(geofence);
  }
  
  async checkGeofences(currentPosition: GeolocationPosition): Promise<GeofenceEvent[]> {
    const events: GeofenceEvent[] = [];
    
    for (const [projectId, geofence] of this.geofences) {
      if (!geofence.enabled) continue;
      
      const distance = this.calculateDistance(
        currentPosition.coords,
        geofence.center
      );
      
      const isInside = distance <= geofence.radius;
      const wasInside = geofence.lastStatus === 'inside';
      
      if (isInside && !wasInside) {
        events.push({
          type: 'enter',
          geofenceId: geofence.id,
          projectId,
          actions: geofence.entryActions
        });
      } else if (!isInside && wasInside) {
        events.push({
          type: 'exit',
          geofenceId: geofence.id,
          projectId,
          actions: geofence.exitActions
        });
      }
      
      geofence.lastStatus = isInside ? 'inside' : 'outside';
    }
    
    return events;
  }
}
```

### 2. Device Sensors Integration
```typescript
// Sensor Integration for Enhanced Measurements
class SensorService {
  async getDeviceOrientation(): Promise<DeviceOrientation> {
    return new Promise((resolve, reject) => {
      if ('DeviceOrientationEvent' in window) {
        const handler = (event: DeviceOrientationEvent) => {
          window.removeEventListener('deviceorientation', handler);
          resolve({
            alpha: event.alpha, // Compass direction
            beta: event.beta,   // Tilt front/back
            gamma: event.gamma  // Tilt left/right
          });
        };
        
        window.addEventListener('deviceorientation', handler);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          window.removeEventListener('deviceorientation', handler);
          reject(new Error('Device orientation timeout'));
        }, 5000);
      } else {
        reject(new Error('Device orientation not supported'));
      }
    });
  }
  
  async measureDistance(): Promise<number> {
    // Use device camera and computer vision for distance measurement
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    
    // Implementation would use computer vision algorithms
    // to estimate distance based on known reference objects
    return this.computeDistanceFromVideo(stream);
  }
  
  async getAmbientLight(): Promise<number> {
    // Use ambient light sensor to adjust camera settings
    if ('AmbientLightSensor' in window) {
      const sensor = new (window as any).AmbientLightSensor();
      
      return new Promise((resolve) => {
        sensor.addEventListener('reading', () => {
          resolve(sensor.illuminance);
          sensor.stop();
        });
        
        sensor.start();
      });
    }
    
    return 0; // Default value if sensor not available
  }
}

// Bluetooth Integration for External Devices
class BluetoothService {
  async connectMeasuringDevice(): Promise<BluetoothDevice> {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ['battery_service'] },
        { namePrefix: 'Laser' },
        { namePrefix: 'Measure' }
      ],
      optionalServices: ['device_information']
    });
    
    const server = await device.gatt.connect();
    
    // Set up data channels for measurements
    await this.setupMeasurementChannel(server);
    
    return device;
  }
  
  private async setupMeasurementChannel(server: BluetoothRemoteGATTServer): Promise<void> {
    const service = await server.getPrimaryService('measurement_service');
    const characteristic = await service.getCharacteristic('measurement_data');
    
    await characteristic.startNotifications();
    
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const value = event.target.value;
      const measurement = this.parseMeasurementData(value);
      this.handleExternalMeasurement(measurement);
    });
  }
}
```

## Performance Optimization

### 1. Resource Management
```typescript
// Efficient Image Handling
class ImageOptimizer {
  async optimizeImage(blob: Blob, options: OptimizationOptions): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const img = await this.createImageFromBlob(blob);
    
    // Calculate optimal dimensions
    const { width, height } = this.calculateOptimalSize(
      img.width,
      img.height,
      options.maxWidth || 1920,
      options.maxHeight || 1080
    );
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw and compress
    context.drawImage(img, 0, 0, width, height);
    
    return new Promise((resolve) => {
      canvas.toBlob(
        resolve,
        'image/jpeg',
        options.quality || 0.8
      );
    });
  }
  
  async generateThumbnail(blob: Blob): Promise<Blob> {
    return this.optimizeImage(blob, {
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.6
    });
  }
}

// Battery-Aware Features
class BatteryManager {
  private batteryLevel: number = 1;
  private isCharging: boolean = false;
  
  async initialize(): Promise<void> {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      
      this.batteryLevel = battery.level;
      this.isCharging = battery.charging;
      
      battery.addEventListener('levelchange', () => {
        this.batteryLevel = battery.level;
        this.adjustPerformanceSettings();
      });
      
      battery.addEventListener('chargingchange', () => {
        this.isCharging = battery.charging;
        this.adjustPerformanceSettings();
      });
    }
  }
  
  private adjustPerformanceSettings(): void {
    if (this.batteryLevel < 0.2 && !this.isCharging) {
      // Enable power saving mode
      this.enablePowerSavingMode();
    } else if (this.batteryLevel > 0.5 || this.isCharging) {
      // Enable full performance mode
      this.enableFullPerformanceMode();
    }
  }
  
  private enablePowerSavingMode(): void {
    // Reduce background sync frequency
    // Lower image quality
    // Disable non-essential animations
    // Reduce GPS accuracy
    this.eventBus.emit('power-saving-enabled');
  }
}
```

## Implementation Timeline

### Phase 1: PWA Foundation (Months 1-3)
- [ ] Progressive Web App setup
- [ ] Offline-first architecture
- [ ] Basic mobile UI components
- [ ] Camera integration
- [ ] Local storage management

### Phase 2: Core Mobile Features (Months 4-6)
- [ ] Mobile quantity take-off
- [ ] Progress tracking and photo capture
- [ ] Voice notes and dictation
- [ ] GPS and location services
- [ ] Basic AR features

### Phase 3: Advanced Features (Months 7-9)
- [ ] Bluetooth device integration
- [ ] Advanced AR overlays
- [ ] QR code scanning
- [ ] Voice commands
- [ ] Sensor integration

### Phase 4: Enterprise Mobile (Months 10-12)
- [ ] Mobile device management (MDM)
- [ ] Advanced security features
- [ ] Offline data synchronization
- [ ] Performance optimization
- [ ] Native app development (if needed)

## Technology Stack

### Frontend
- **PWA Framework**: React + TypeScript
- **Offline Storage**: IndexedDB + Dexie.js
- **Service Worker**: Workbox
- **Camera/Media**: WebRTC APIs
- **AR**: WebXR, Three.js, AR.js

### Mobile-Specific
- **Location**: Geolocation API
- **Sensors**: Generic Sensor API, Device Orientation
- **Bluetooth**: Web Bluetooth API
- **Voice**: Speech Recognition/Synthesis APIs
- **Push Notifications**: Web Push API

### Performance
- **Image Processing**: Canvas API, WebAssembly
- **Caching**: Cache API, Service Worker
- **Compression**: Client-side image optimization
- **Sync**: Background Sync API

This comprehensive mobile strategy ensures construction professionals can access and update critical project data from anywhere, bridging the gap between office-based planning and field execution.
