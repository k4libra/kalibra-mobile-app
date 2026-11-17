/**
 * Selector of the course whose progress is shown.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Card, Icon, IconBox, Text } from '@/components/ui';
import { colors, radius, shadows, spacing, TOUCH_TARGET } from '@/theme/tokens';
import type { EnrolledCourse } from '@/types/course';

/**
 * Props accepted by {@link CourseSelector}.
 */
export interface CourseSelectorProps {
  /** Enrolled courses the student can pick. */
  courses: EnrolledCourse[];
  /** Course currently shown. */
  selectedCourseId: string;
  /** Called with the course the student picks. */
  onSelect: (courseId: string) => void;
}

/**
 * Shows the active course and opens a sheet to switch to another enrolled course.
 */
export function CourseSelector({ courses, selectedCourseId, onSelect }: CourseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = courses.find(course => course.id === selectedCourseId);
  if (!selected) return null;
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Curso activo: ${selected.name}. Cambiar de curso`}
        onPress={() => setIsOpen(true)}
        style={styles.trigger}
      >
        <View style={styles.badge}>
          <Icon name={selected.icon} size="md" color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="labelM" color="secondary">
            Curso activo
          </Text>
          <Text variant="title">
            {selected.name}
          </Text>
        </View>
        <Icon name="expand_more" size="lg" color={colors.contentPrimary} />
      </Pressable>
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)} statusBarTranslucent>
        <Pressable accessibilityRole="button" accessibilityLabel="Cerrar selector" style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <Card style={styles.sheet}>
            <Text variant="title" isHeading>
              Elige un curso
            </Text>
            {courses.map(course => {
              const isActive = course.id === selectedCourseId;
              return (
                <Pressable
                  key={course.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => {
                    onSelect(course.id);
                    setIsOpen(false);
                  }}
                  style={[styles.option, isActive && styles.optionActive]}
                >
                  <IconBox icon={course.icon} size="sm" />
                  <View style={styles.flex}>
                    <Text variant="labelL">{course.name}</Text>
                    <Text variant="bodyM" color="secondary">
                      {course.code}
                    </Text>
                  </View>
                  {isActive && <Icon name="check" size="md" color={colors.primaryStrong} />}
                </Pressable>
              );
            })}
          </Card>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: 12, minHeight: 80, borderRadius: radius.xl, backgroundColor: colors.white, ...shadows.card },
  badge: { width: 40, height: 40, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryContainerSoft },
  flex: { flex: 1 },
  backdrop: { flex: 1, justifyContent: 'center', padding: spacing.gutter, backgroundColor: colors.overlay },
  sheet: { gap: spacing.md, ...shadows.floating },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, minHeight: TOUCH_TARGET, padding: spacing.md, borderRadius: radius.md },
  optionActive: { backgroundColor: colors.primarySubtle },
});
