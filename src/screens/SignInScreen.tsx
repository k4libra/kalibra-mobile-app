
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
    AuthAlert,
    AuthHeader,
    AuthTextField,
} from '../components/auth';

import { useAuth } from '../hooks/useAuth';

import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<
    RootStackParamList,
    'SignIn'
>;

export function SignInScreen({ navigation }: Props) {
    const {
        signIn,
        isSubmitting,
        error,
        clearError,
    } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberDevice, setRememberDevice] =
        useState(false);

    const [fieldError, setFieldError] = useState<
        string | null
    >(null);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setFieldError(null);
        clearError();
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setFieldError(null);
        clearError();
    };

    const handleSignIn = async () => {
        if (isSubmitting) return;

        setFieldError(null);
        clearError();

        if (!email.trim() || !password) {
            setFieldError(
                'Ingresa tu correo institucional y contraseña.',
            );
            return;
        }

        try {
            await signIn({
                email: email.trim(),
                password,
                rememberDevice,
            });

            // RootNavigator will switch to Tabs
            // when the authentication state changes.
        } catch {
            // The authentication context exposes the error.
        }
    };

    const handleSignUp = () => {
        clearError();
        setFieldError(null);
        navigation.navigate('SignUp');
    };

    const alertMessage = fieldError ?? error?.message;

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <AuthHeader
                        title="Bienvenido de nuevo"
                        subtitle="Inicia sesión para continuar aprendiendo con Kalibra."
                    />

                    <View style={styles.form}>
                        {alertMessage ? (
                            <AuthAlert
                                title="No pudimos iniciar sesión"
                                message={alertMessage}
                                onDismiss={() => {
                                    setFieldError(null);
                                    clearError();
                                }}
                            />
                        ) : null}

                        <AuthTextField
                            label="Correo institucional"
                            value={email}
                            onChangeText={handleEmailChange}
                            placeholder="tu.correo@universidad.edu"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            textContentType="emailAddress"
                            editable={!isSubmitting}
                            returnKeyType="next"
                        />

                        <AuthTextField
                            label="Contraseña"
                            value={password}
                            onChangeText={handlePasswordChange}
                            placeholder="Ingresa tu contraseña"
                            secureTextEntry
                            autoCapitalize="none"
                            autoComplete="password"
                            textContentType="password"
                            editable={!isSubmitting}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                void handleSignIn();
                            }}
                        />

                        <Pressable
                            style={styles.rememberRow}
                            onPress={() =>
                                setRememberDevice((previous) => !previous)
                            }
                            disabled={isSubmitting}
                            accessibilityRole="checkbox"
                            accessibilityState={{
                                checked: rememberDevice,
                                disabled: isSubmitting,
                            }}
                            accessibilityLabel="Recordar este dispositivo"
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    rememberDevice && styles.checkboxChecked,
                                ]}
                            >
                                {rememberDevice ? (
                                    <Text style={styles.checkmark}>✓</Text>
                                ) : null}
                            </View>

                            <Text style={styles.rememberText}>
                                Recordar este dispositivo
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                void handleSignIn();
                            }}
                            disabled={isSubmitting}
                            accessibilityRole="button"
                            accessibilityLabel="Iniciar sesión"
                            style={({ pressed }) => [
                                styles.submitButton,
                                pressed && styles.submitButtonPressed,
                                isSubmitting && styles.submitButtonDisabled,
                            ]}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.submitText}>
                                    Iniciar sesión
                                </Text>
                            )}
                        </Pressable>

                        <View style={styles.registerRow}>
                            <Text style={styles.registerPrompt}>
                                ¿Aún no tienes una cuenta?
                            </Text>

                            <Pressable
                                onPress={handleSignUp}
                                disabled={isSubmitting}
                                accessibilityRole="button"
                            >
                                <Text style={styles.registerLink}>
                                    Regístrate
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FAF8FF',
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 36,
        justifyContent: 'center',
    },

    content: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },

    form: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 26,
        borderWidth: 1,
        borderColor: '#ECEEFA',
    },

    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 22,
        minHeight: 30,
    },

    checkbox: {
        width: 19,
        height: 19,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#B6BBD0',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    checkboxChecked: {
        backgroundColor: '#6C5CE7',
        borderColor: '#6C5CE7',
    },

    checkmark: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 17,
    },

    rememberText: {
        color: '#60657A',
        fontSize: 12,
    },

    submitButton: {
        minHeight: 52,
        borderRadius: 12,
        backgroundColor: '#6C5CE7',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },

    submitButtonPressed: {
        backgroundColor: '#5847CE',
    },

    submitButtonDisabled: {
        opacity: 0.7,
    },

    submitText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    registerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 24,
    },

    registerPrompt: {
        color: '#60657A',
        fontSize: 12,
    },

    registerLink: {
        color: '#6C5CE7',
        fontSize: 12,
        fontWeight: '700',
    },
});
