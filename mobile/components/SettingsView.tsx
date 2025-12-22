
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

interface SettingsViewProps {
  onClose: () => void;
}

export default function SettingsView({ onClose }: SettingsViewProps) {
  const insets = useSafeAreaInsets();
  
  // Local state for settings (in a real app, this would be in a store)
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [highQualityAnim, setHighQualityAnim] = useState(true);

  const toggleSwitch = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    setter(!value);
    if (hapticsEnabled) Haptics.selectionAsync();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity 
          onPress={() => {
            if (hapticsEnabled) Haptics.selectionAsync();
            onClose();
          }}
          style={styles.closeBtn}
        >
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Haptic Feedback</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={() => toggleSwitch(setHapticsEnabled, hapticsEnabled)}
              trackColor={{ false: '#3a3a3c', true: '#32D74B' }}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Sound Effects</Text>
            <Switch
              value={audioEnabled}
              onValueChange={() => toggleSwitch(setAudioEnabled, audioEnabled)}
              trackColor={{ false: '#3a3a3c', true: '#32D74B' }}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={() => toggleSwitch(setDarkMode, darkMode)}
              trackColor={{ false: '#3a3a3c', true: '#32D74B' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>High Quality Animations</Text>
            <Switch
              value={highQualityAnim}
              onValueChange={() => toggleSwitch(setHighQualityAnim, highQualityAnim)}
              trackColor={{ false: '#3a3a3c', true: '#32D74B' }}
              thumbColor={'#fff'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>3.0.1 (Build 42)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Engine</Text>
            <Text style={styles.infoValue}>Grump v3 Core</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.dangerBtn}>
          <Text style={styles.dangerText}>Reset All Data</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#0A84FF',
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  label: {
    fontSize: 17,
    color: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  infoLabel: {
    fontSize: 17,
    color: '#fff',
  },
  infoValue: {
    fontSize: 17,
    color: '#8E8E93',
  },
  dangerBtn: {
    marginTop: 40,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  dangerText: {
    color: '#FF453A',
    fontSize: 17,
    fontWeight: '600',
  },
});
