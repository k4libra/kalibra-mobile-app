
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
    'SignUp'
>;

type FieldErrors = {
    fullName?: string;
    email?: string;
    password?: string;
};

const INSTITUTIONAL_EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.edu(?:\.[a-z]{2,})?$/i;

export function SignUpScreen({ navigation }: Props) {
    const {
        signUp,
        isSubmitting,
        error,
        clearError,
    } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [fieldErrors, setFieldErrors] =
        useState<FieldErrors>({});

    const handleFullNameChange = (value: string) => {
        setFullName(value);
        setFieldErrors((previous) => ({
            ...previous,
            fullName: undefined,
        }));
        clearError();
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setFieldErrors((previous) => ({
            ...previous,
            email: undefined,
        }));
        clearError();
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setFieldErrors((previous) => ({
            ...previous,
            password: undefined,
        }));
        clearError();
    };

    const validateForm = (): boolean => {
        const nextErrors: FieldErrors = {};

        if (!fullName.trim()) {
            nextErrors.fullName =
                'Ingresa tu nombre completo.';
        }

        if (!email.trim()) {
            nextErrors.email =
                'Ingresa tu correo institucional.';
        } else if (
            !INSTITUTIONAL_EMAIL_REGEX.test(email.trim())
        ) {
            nextErrors.email =
                'Ingresa un correo institucional válido.';
        }

        if (!password) {
            nextErrors.password =
                'Ingresa una contraseña.';
        } else if (password.length < 8) {
            nextErrors.password =
                'La contraseña debe tener al menos 8 caracteres.';
        }

        setFieldErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSignUp = async () => {
        if (isSubmitting) return;

        clearError();

        if (!validateForm()) {
            return;
        }

        try {
            await signUp({
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            // AuthProvider updates the session.
            // RootNavigator will show the authenticated
            // screens once navigation is integrated.
        } catch {
            // The authentication context exposes
            // the error for the alert below.
        }
    };

    const handleSignIn = () => {
        clearError();
        setFieldErrors({});
        navigation.navigate('SignIn');
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={
                Platform.OS === 'ios'
                    ? 'padding'
                    : undefined
            }
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <AuthHeader
                        title="Crea tu cuenta"
                        subtitle="Comienza a aprender a tu ritmo con Kalibra."
                    />

                    <View style={styles.form}>
                        {error ? (
                            <AuthAlert
                                title={
                                    error.code === 'EMAIL_ALREADY_REGISTERED'
                                        ? 'Correo ya registrado'
                                        : 'No pudimos crear tu cuenta'
                                }
                                message={error.message}
                                onDismiss={clearError}
                            />
                        ) : null}

                        <AuthTextField
                            label="Nombre completo"
                            value={fullName}
                            onChangeText={handleFullNameChange}
                            placeholder="Ingresa tu nombre completo"
                            error={fieldErrors.fullName}
                            autoCapitalize="words"
                            autoComplete="name"
                            textContentType="name"
                            editable={!isSubmitting}
                            returnKeyType="next"
                        />

                        <AuthTextField
                            label="Correo institucional"
                            value={email}
                            onChangeText={handleEmailChange}
                            placeholder="tu.correo@universidad.edu"
                            error={fieldErrors.email}
                            helperText="Utiliza tu correo institucional."
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
                            placeholder="Crea una contraseña"
                            error={fieldErrors.password}
                            helperText="Debe tener al menos 8 caracteres."
                            secureTextEntry
                            autoCapitalize="none"
                            autoComplete="new-password"
                            textContentType="newPassword"
                            editable={!isSubmitting}
                            returnKeyType="done"
                            onSubmitEditing={() => {
                                void handleSignUp();
                            }}
                        />

                        <Pressable
                            onPress={() => {
                                void handleSignUp();
                            }}
                            disabled={isSubmitting}
                            accessibilityRole="button"
                            accessibilityLabel="Crear cuenta"
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
                                    Crear cuenta
                                </Text>
                            )}
                        </Pressable>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginPrompt}>
                                ¿Ya tienes una cuenta?
                            </Text>

                            <Pressable
                                onPress={handleSignIn}
                                disabled={isSubmitting}
                                accessibilityRole="button"
                                accessibilityLabel="Ir a iniciar sesión"
                            >
                                <Text style={styles.loginLink}>
                                    Inicia sesión
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <Text style={styles.footerText}>
                        Al registrarte, podrás consultar tus cursos,
                        ejercicios y progreso de aprendizaje.
                    </Text>
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
        paddingVertical: 32,
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

    submitButton: {
        minHeight: 52,
        borderRadius: 12,
        backgroundColor: '#6C5CE7',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginTop: 6,
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

    loginRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        marginTop: 24,
    },

    loginPrompt: {
        color: '#60657A',
        fontSize: 12,
    },

    loginLink: {
        color: '#6C5CE7',
        fontSize: 12,
        fontWeight: '700',
    },

    footerText: {
        marginTop: 20,
        paddingHorizontal: 12,
        color: '#747B90',
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
    },
});
