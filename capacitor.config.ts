import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.workout.tracker',
    appName: '健身计划',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    android: {
        allowMixedContent: true,
        minVersion: 22,
        targetVersion: 33
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 3000,
            backgroundColor: '#ffffff',
            showSpinner: true,
            spinnerColor: '#ff6b6b'
        },
        StatusBar: {
            style: 'dark',
            backgroundColor: '#ffffff'
        }
    }
};

export default config;

