
import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    type KeyboardTypeOptions,
    type TextInputProps,
} from 'react-native';

type AuthTextFieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;

    placeholder?: string;
    error?: string;
    helperText?: string;

    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: TextInputProps['autoCapitalize'];
    autoComplete?: TextInputProps['autoComplete'];
    textContentType?: TextInputProps['textContentType'];

    editable?: boolean;
    returnKeyType?: TextInputProps['returnKeyType'];
    onSubmitEditing?: TextInputProps['onSubmitEditing'];
};

export function AuthTextField({
                                  label,
                                  value,
                                  onChangeText,
                                  placeholder,
                                  error,
                                  helperText,
                                  secureTextEntry = false,
                                  keyboardType = 'default',
                                  autoCapitalize = 'none',
                                  autoComplete,
                                  textContentType,
                                  editable = true,
                                  returnKeyType,
                                  onSubmitEditing,
                              }: AuthTextFieldProps) {
    const [isPasswordVisible, setIsPasswordVisible] =
        useState(false);

    const [isFocused, setIsFocused] = useState(false);

    const isPassword = secureTextEntry;

    const shouldHidePassword =
        isPassword && !isPasswordVisible;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focusedInput,
                    Boolean(error) && styles.errorInput,
                    !editable && styles.disabledInput,
                ]}
            >
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3B5"
                    secureTextEntry={shouldHidePassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                    editable={editable}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCorrect={false}
                    accessibilityLabel={label}
                />

                {isPassword && (
                    <Pressable
                        onPress={() =>
                            setIsPasswordVisible((previous) => !previous)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={
                            isPasswordVisible
                                ? 'Ocultar contraseña'
                                : 'Mostrar contraseña'
                        }
                        hitSlop={10}
                        style={styles.visibilityButton}
                    >
                        <Text style={styles.visibilityText}>
                            {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
                        </Text>
                    </Pressable>
                )}
            </View>

            {error ? (
                <View style={styles.messageContainer}>
                    <Text
                        style={styles.errorIcon}
                        accessibilityElementsHidden
                        importantForAccessibility="no"
                    >
                        !
                    </Text>

                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            ) : helperText ? (
                <Text style={styles.helperText}>
                    {helperText}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 18,
    },

    label: {
        color: '#141A33',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },

    inputContainer: {
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DDE1F0',
        borderRadius: 12,
        paddingHorizontal: 14,
    },

    focusedInput: {
        borderColor: '#6C5CE7',
        borderWidth: 1.5,
    },

    errorInput: {
        borderColor: '#D92D20',
        backgroundColor: '#FFFDFD',
    },

    disabledInput: {
        backgroundColor: '#F3F4F8',
        opacity: 0.7,
    },

    input: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 13,
        color: '#141A33',
        fontSize: 14,
    },

    visibilityButton: {
        paddingVertical: 10,
        paddingLeft: 12,
        justifyContent: 'center',
    },

    visibilityText: {
        color: '#6C5CE7',
        fontSize: 12,
        fontWeight: '700',
    },

    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
        marginTop: 7,
    },

    errorIcon: {
        width: 15,
        height: 15,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#D92D20',
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 15,
    },

    errorText: {
        flex: 1,
        color: '#D92D20',
        fontSize: 11,
        lineHeight: 17,
    },

    helperText: {
        color: '#747B90',
        fontSize: 11,
        lineHeight: 17,
        marginTop: 7,
    },
});
