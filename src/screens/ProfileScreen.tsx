
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    AuthAlert,
    PreferenceRow,
    ProfileSummary,
} from '../components/auth';

import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export function ProfileScreen() {
    const { signOut } = useAuth();

    const {
        user,
        stats,
        preferences,
        isLoading,
        isSubmitting,
        error,
        setDarkMode,
        setDailyReminders,
        clearError,
    } = useProfile();

    const [showSignOutDialog, setShowSignOutDialog] =
        useState(false);

    const handleSignOut = async () => {
        setShowSignOutDialog(false);

        try {
            await signOut();

            // RootNavigator will display SignIn
            // when the session becomes null.
        } catch {
            // AuthContext provides the error.
        }
    };

    const handleDarkMode = async (enabled: boolean) => {
        try {
            await setDarkMode(enabled);
        } catch {
            // The error is displayed below.
        }
    };

    const handleDailyReminders = async (
        enabled: boolean,
    ) => {
        try {
            await setDailyReminders(enabled);
        } catch {
            // The error is displayed below.
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color="#6C5CE7"
                />
                <Text style={styles.loadingText}>
                    Cargando perfil...
                </Text>
            </View>
        );
    }

    if (!user || !stats || !preferences) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emptyTitle}>
                    Perfil no disponible
                </Text>

                <Text style={styles.emptyDescription}>
                    Inicia sesión para consultar tu perfil.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Encabezado */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Mi perfil
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Consulta tu información y preferencias.
                    </Text>
                </View>

                {/* Mensajes de error */}
                {error ? (
                    <AuthAlert
                        title="No se pudo completar la acción"
                        message={error.message}
                        onDismiss={clearError}
                    />
                ) : null}

                {/* Información y estadísticas */}
                <ProfileSummary
                    user={user}
                    stats={stats}
                />

                {/* Preferencias */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Preferencias
                    </Text>

                    <View style={styles.preferencesCard}>
                        <PreferenceRow
                            title="Modo nocturno"
                            description="Reduce el brillo de la interfaz"
                            icon="☾"
                            value={preferences.darkMode}
                            disabled={isSubmitting}
                            onValueChange={(value) => {
                                void handleDarkMode(value);
                            }}
                        />

                        <PreferenceRow
                            title="Recordatorios diarios"
                            description="Recibe avisos para continuar practicando"
                            icon="◷"
                            value={preferences.dailyReminders}
                            disabled={isSubmitting}
                            onValueChange={(value) => {
                                void handleDailyReminders(value);
                            }}
                            showDivider={false}
                        />
                    </View>
                </View>

                {/* Cuenta */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Cuenta
                    </Text>

                    <View style={styles.accountCard}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Cerrar sesión"
                            disabled={isSubmitting}
                            onPress={() => setShowSignOutDialog(true)}
                            style={({ pressed }) => [
                                styles.signOutButton,
                                pressed && styles.signOutPressed,
                            ]}
                        >
                            <View style={styles.signOutIcon}>
                                <Text style={styles.signOutIconText}>
                                    ↪
                                </Text>
                            </View>

                            <View style={styles.signOutContent}>
                                <Text style={styles.signOutTitle}>
                                    Cerrar sesión
                                </Text>

                                <Text style={styles.signOutDescription}>
                                    Salir de tu cuenta de Kalibra
                                </Text>
                            </View>

                            <Text style={styles.chevron}>
                                ›
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Kalibra · Tu aprendizaje, a tu ritmo
                </Text>
            </ScrollView>

            {/* Confirmación de cierre de sesión */}
            <ConfirmDialog
                isVisible={showSignOutDialog}
                icon="logout"
                tone="danger"
                title="¿Cerrar sesión?"
                description="Tendrás que iniciar sesión nuevamente para acceder a tu cuenta."
                confirmLabel="Sí, cerrar sesión"
                cancelLabel="Cancelar"
                onConfirm={() => {
                    void handleSignOut();
                }}
                onCancel={() => setShowSignOutDialog(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FAF8FF',
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 40,
    },

    centered: {
        flex: 1,
        backgroundColor: '#FAF8FF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },

    loadingText: {
        marginTop: 12,
        color: '#60657A',
        fontSize: 13,
    },

    emptyTitle: {
        color: '#141A33',
        fontSize: 18,
        fontWeight: '700',
    },

    emptyDescription: {
        marginTop: 8,
        color: '#60657A',
        fontSize: 13,
        textAlign: 'center',
    },

    header: {
        marginBottom: 22,
    },

    headerTitle: {
        color: '#141A33',
        fontSize: 24,
        fontWeight: '800',
    },

    headerSubtitle: {
        marginTop: 5,
        color: '#60657A',
        fontSize: 12,
        lineHeight: 19,
    },

    section: {
        marginTop: 26,
    },

    sectionTitle: {
        color: '#141A33',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 12,
    },

    preferencesCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECEEFA',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 2,
    },

    accountCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#ECEEFA',
        borderRadius: 16,
        overflow: 'hidden',
    },

    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 76,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    signOutPressed: {
        backgroundColor: '#FFF1F0',
    },

    signOutIcon: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: '#FFF1F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    signOutIconText: {
        color: '#C91E22',
        fontSize: 22,
        fontWeight: '700',
    },

    signOutContent: {
        flex: 1,
    },

    signOutTitle: {
        color: '#C91E22',
        fontSize: 13,
        fontWeight: '700',
    },

    signOutDescription: {
        color: '#747B90',
        fontSize: 11,
        marginTop: 4,
    },

    chevron: {
        color: '#9CA3B5',
        fontSize: 24,
    },

    footer: {
        marginTop: 28,
        color: '#A2A7BA',
        fontSize: 11,
        textAlign: 'center',
    },
});
