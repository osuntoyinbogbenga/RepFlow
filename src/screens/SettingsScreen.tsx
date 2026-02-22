import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Share, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { Screen } from '../components/common/Screen';
import { PressableScale } from '../components/common/PressableScale';
import { AnimatedCard } from '../components/common/AnimatedCard';
import { Button } from '../components/common/Button';
import { Typography, Radius } from '../constants/theme';

function SettingRow({ icon, iconColor, label, value, onPress, rightElement, danger = false, colors }: any) {
  return (
    <PressableScale onPress={onPress} disabled={!onPress && !rightElement}>
      <View style={[styles.row, { borderBottomColor: colors.borderSubtle }]}>
        <View style={[styles.iconWrap, { backgroundColor: (iconColor || colors.accent) + '18' }]}>
          <Ionicons name={icon} size={16} color={iconColor || colors.accent} />
        </View>
        <Text style={[Typography.bodyMedium, { color: danger ? colors.error : colors.text, flex: 1, marginLeft: 12 }]}>{label}</Text>
        {value && <Text style={[Typography.smMedium, { color: colors.textSecondary }]}>{value}</Text>}
        {rightElement}
        {onPress && !rightElement && <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 4 }} />}
      </View>
    </PressableScale>
  );
}

export function SettingsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { user, settings, saveSettings, saveUser, exportData, resetAllData } = useStore(s => ({
    user: s.user, settings: s.settings, saveSettings: s.saveSettings,
    saveUser: s.saveUser, exportData: s.exportData, resetAllData: s.resetAllData,
  }));

  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');

  const goals = [
    { id: 'strength', label: 'Strength' },
    { id: 'hypertrophy', label: 'Hypertrophy' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'general', label: 'General Fitness' },
  ];

  const handleSaveName = () => {
    if (nameInput.trim() && user) {
      saveUser({ ...user, name: nameInput.trim() });
    }
    setShowNameModal(false);
  };

  return (
    <Screen title="Settings" subtitle="App">

      {/* Name Edit Modal */}
      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modal, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <Text style={[Typography.h2, { color: colors.text, marginBottom: 16 }]}>Your Name</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
              placeholderTextColor={colors.textTertiary}
              autoFocus
              style={[styles.input, { color: colors.text, backgroundColor: colors.bgSecondary, borderColor: colors.border }]}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <Button title="Cancel" variant="secondary" onPress={() => { setNameInput(user?.name || ''); setShowNameModal(false); }} style={{ flex: 1 }} />
              <Button title="Save" onPress={handleSaveName} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      <Text style={[Typography.xsCaps, { color: colors.textSecondary, marginBottom: 8, marginTop: 8 }]}>Profile</Text>
      <AnimatedCard delay={0} style={styles.section}>
        <SettingRow icon="person-outline" label="Name" value={user?.name} colors={colors}
          onPress={() => { setNameInput(user?.name || ''); setShowNameModal(true); }} />
        <SettingRow icon="trophy-outline" iconColor="#F59E0B" label="Fitness Goal"
          value={goals.find(g => g.id === user?.fitnessGoal)?.label} colors={colors}
          onPress={() => Alert.alert('Fitness Goal', 'Select your primary goal', goals.map(g => ({
            text: g.label, onPress: () => { if (user) saveUser({ ...user, fitnessGoal: g.id as any }); }
          })))} />
      </AnimatedCard>

      <Text style={[Typography.xsCaps, { color: colors.textSecondary, marginBottom: 8, marginTop: 20 }]}>Preferences</Text>
      <AnimatedCard delay={100} style={styles.section}>
        <SettingRow icon="moon-outline" label="Theme"
          value={settings.theme.charAt(0).toUpperCase() + settings.theme.slice(1)} colors={colors}
          onPress={() => Alert.alert('Theme', '', [
            { text: 'Dark', onPress: () => saveSettings({ theme: 'dark' }) },
            { text: 'Light', onPress: () => saveSettings({ theme: 'light' }) },
            { text: 'System', onPress: () => saveSettings({ theme: 'system' }) },
          ])} />
        <SettingRow icon="scale-outline" label="Weight Unit"
          value={settings.weightUnit.toUpperCase()} colors={colors}
          onPress={() => saveSettings({ weightUnit: settings.weightUnit === 'kg' ? 'lbs' : 'kg' })} />
        <SettingRow icon="phone-portrait-outline" label="Haptic Feedback" colors={colors}
          rightElement={<Switch value={settings.hapticFeedback} onValueChange={v => saveSettings({ hapticFeedback: v })}
            trackColor={{ true: colors.accent }} thumbColor="#fff" />} />
        <SettingRow icon="accessibility-outline" label="Reduce Motion" colors={colors}
          rightElement={<Switch value={settings.reduceMotion} onValueChange={v => saveSettings({ reduceMotion: v })}
            trackColor={{ true: colors.accent }} thumbColor="#fff" />} />
      </AnimatedCard>

      <Text style={[Typography.xsCaps, { color: colors.textSecondary, marginBottom: 8, marginTop: 20 }]}>Schedule</Text>
      <AnimatedCard delay={200} style={styles.section}>
        <SettingRow icon="calendar-outline" label="Gym Schedule & Reminders" colors={colors}
          onPress={() => navigation.navigate('Schedule')} />
      </AnimatedCard>

      <Text style={[Typography.xsCaps, { color: colors.textSecondary, marginBottom: 8, marginTop: 20 }]}>Data</Text>
      <AnimatedCard delay={300} style={styles.section}>
        <SettingRow icon="download-outline" iconColor="#10B981" label="Export Data (JSON)" colors={colors}
          onPress={async () => { await Share.share({ title: 'RepFlow Export', message: exportData() }); }} />
        <SettingRow icon="trash-outline" label="Reset All Data" danger colors={colors}
          onPress={() => Alert.alert('Reset All Data?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset Everything', style: 'destructive', onPress: resetAllData },
          ])} />
      </AnimatedCard>

      <AnimatedCard delay={400} style={{ padding: 24, marginTop: 24, alignItems: 'center', marginBottom: 16 }}>
        <Text style={[Typography.h3, { color: colors.text }]}>RepFlow</Text>
        <Text style={[Typography.sm, { color: colors.textSecondary, marginTop: 4 }]}>Train with intention.</Text>
        <Text style={[Typography.xs, { color: colors.textTertiary, marginTop: 8 }]}>Version 1.0.0 · Free forever · No ads</Text>
      </AnimatedCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  iconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 360, borderRadius: Radius.xl, borderWidth: 1, padding: 24 },
  input: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
});