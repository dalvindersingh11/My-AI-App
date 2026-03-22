import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type LoginErrors = {
  email?: string;
  password?: string;
};

const taskSummary = [
  {
    label: 'Completed',
    value: 18,
    accent: '#1D8348',
    note: 'Strong follow-through this week',
  },
  {
    label: 'Paused',
    value: 19,
    accent: '#D68910',
    note: 'Tasks Paused',
  },
  {
    label: 'Pending',
    value: 7,
    accent: '#D68910',
    note: 'Tasks waiting for action',
  },
  {
    label: 'Missed',
    value: 3,
    accent: '#C0392B',
    note: 'Needs attention today',
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

function App(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const errors = validateLogin(email, password);

  const handleLogin = () => {
    setSubmitted(true);

    if (Object.keys(errors).length === 0) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSubmitted(false);
    setPassword('');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0B172A" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          {isLoggedIn ? (
            <HomeScreen email={email.trim()} onLogout={handleLogout} />
          ) : (
            <LoginScreen
              email={email}
              password={password}
              errors={submitted ? errors : {}}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onLogin={handleLogin}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

type LoginScreenProps = {
  email: string;
  password: string;
  errors: LoginErrors;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
};

function LoginScreen({
  email,
  password,
  errors,
  onEmailChange,
  onPasswordChange,
  onLogin,
}: LoginScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.loginScrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.heroCard}>
        <Text style={styles.badge}>AI TASK MANAGER</Text>
        <Text style={styles.heroTitle}>Track work with clarity.</Text>
        <Text style={styles.heroSubtitle}>
          Sign in to view today&apos;s task summary and keep delivery on track.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Login</Text>
        <Text style={styles.formCaption}>
          Use any valid email and a password with at least 6 characters.
        </Text>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="name@example.com"
            placeholderTextColor="#7E8AA2"
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            onChangeText={onEmailChange}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter password"
            placeholderTextColor="#7E8AA2"
            secureTextEntry
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={password}
            onChangeText={onPasswordChange}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        <Pressable style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

type HomeScreenProps = {
  email: string;
  onLogout: () => void;
};

function HomeScreen({ email, onLogout }: HomeScreenProps) {
  const totalTasks = taskSummary.reduce((sum, item) => sum + item.value, 0);

  return (
    <ScrollView contentContainerStyle={styles.homeScrollContent}>
      <View style={styles.homeHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.userText}>{email}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.summaryBanner}>
        <Text style={styles.summaryLabel}>Today&apos;s overview</Text>
        <Text style={styles.summaryValue}>{totalTasks} Active Tasks</Text>
        <Text style={styles.summaryNote}>
          Delivery health is stable. Pending items are the main follow-up area.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {taskSummary.map(item => (
          <View
            key={item.label}
            style={[styles.statCard, { borderTopColor: item.accent }]}
          >
            <Text style={styles.statLabel}>{item.label}</Text>
            <Text style={[styles.statValue, { color: item.accent }]}>
              {item.value}
            </Text>
            <Text style={styles.statNote}>{item.note}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B172A',
  },
  flex: {
    flex: 1,
  },
  loginScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#0B172A',
  },
  heroCard: {
    backgroundColor: '#14233C',
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1F3B63',
    color: '#D8E6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 18,
  },
  heroTitle: {
    color: '#F8FAFC',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: '#A9B7D0',
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 28,
    padding: 22,
  },
  formTitle: {
    color: '#10213A',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  formCaption: {
    color: '#52627C',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  fieldBlock: {
    marginBottom: 18,
  },
  label: {
    color: '#1A2B49',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#EEF3F8',
    borderWidth: 1,
    borderColor: '#D8E1EC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 15,
    color: '#10213A',
  },
  inputError: {
    borderColor: '#C0392B',
  },
  errorText: {
    marginTop: 6,
    color: '#C0392B',
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#0E4D92',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  homeScrollContent: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0B172A',
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    color: '#8FA9CC',
    fontSize: 14,
    marginBottom: 4,
  },
  userText: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#294766',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoutText: {
    color: '#DCE8F8',
    fontWeight: '700',
  },
  summaryBanner: {
    backgroundColor: '#123761',
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,
  },
  summaryLabel: {
    color: '#A9C8F5',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryNote: {
    color: '#D6E4F7',
    fontSize: 15,
    lineHeight: 22,
  },
  statsGrid: {
    gap: 16,
  },
  statCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    borderTopWidth: 6,
  },
  statLabel: {
    color: '#4F5F78',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 8,
  },
  statNote: {
    color: '#6F7D92',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default App;
