/** Academic mastery, recommendations and the initial student state. */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { CourseSelector } from '@/components/progress';
import { Button, Card, Chip, ErrorState, Icon, IconBox, LoadingState, MasteryRing, ProgressBar, StatStrip, Text } from '@/components/ui';
import { useCurrentStudent } from '@/hooks/useCurrentStudent';
import { useProgress } from '@/hooks/useProgress';
import { useRootNavigation } from '@/navigation/useRootNavigation';
import { colors, radius } from '@/theme/tokens';
import type { SubtopicProgress } from '@/types/progress';
import type { Tone } from '@/types/ui';
import { plural } from '@/utils/plural';

const levelOf = (mastery: number | null): { label: string; tone: Tone } => mastery === null
  ? { label: 'Sin iniciar', tone: 'neutral' }
  : mastery > 70 ? { label: 'Nivel alto', tone: 'success' }
    : mastery >= 40 ? { label: 'Nivel medio', tone: 'primary' }
      : { label: 'Nivel bajo', tone: 'warning' };

/** Shows measured progress while keeping preview states independent of saved data. */
export function ProgressScreen() {
  const navigation = useRootNavigation();
  const { student } = useCurrentStudent();
  const { courses, selectedCourseId, selectCourse, progress, isLoading, error } = useProgress();
  const [isInitialPreview, setIsInitialPreview] = useState(false);
  const hasActivity = Boolean(progress?.hasActivity) && !isInitialPreview;
  const mastered = progress?.subtopics.filter(item => item.mastery !== null && item.mastery > 70) ?? [];
  const needsReinforcement = progress?.subtopics.filter(item => item.mastery !== null && item.mastery < 40).length ?? 0;
  const mastery = progress?.course.mastery ?? null;
  const practice = (subtopicId: string) => {
    const subtopic = progress?.subtopics.find(item => item.id === subtopicId);
    if (selectedCourseId) navigation.navigate('Exercise', { courseId: selectedCourseId, subtopicId, calibration: subtopic && { name: subtopic.name, mastery: subtopic.mastery } });
  };
  const startPracticing = () => {
    const first = progress?.subtopics[0];
    if (first && selectedCourseId) practice(first.id);
    else if (selectedCourseId) navigation.navigate('CourseSubtopics', { courseId: selectedCourseId });
    else navigation.navigate('Tabs', { screen: 'Courses' });
  };

  return <ScreenContainer header={<AppHeader avatar={student?.avatar} onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}>
    <View style={styles.stack}>
      <View style={styles.heading}>
        <View style={styles.titleRow}>
          <Text variant="headlineL" isHeading>Mi progreso</Text>
          {progress?.hasActivity && <Pressable accessibilityRole="button" accessibilityLabel={isInitialPreview ? 'Ver mi progreso' : 'Ver vista inicial'} onPress={() => setIsInitialPreview(value => !value)} style={styles.previewLink}>
            <Icon name="visibility" size="xs" /><Text variant="bodyMBold" color="brand">{isInitialPreview ? 'Ver mi progreso' : 'Ver vista inicial'}</Text>
          </Pressable>}
        </View>
        {selectedCourseId && <CourseSelector courses={courses} selectedCourseId={selectedCourseId} onSelect={selectCourse} />}
      </View>
      {error && <ErrorState message={error} />}
      {isLoading ? <LoadingState /> : !error && <>
        {!hasActivity ? <Card style={styles.empty}>
          <View style={styles.illustration}><Icon name="query_stats" size="4xl" /></View>
          <Text variant="headlineM" isHeading style={styles.center}>Aún no estimamos tu dominio</Text>
          <Text color="secondary" style={styles.center}>Resuelve tu primer ejercicio y Kalibra empezará a estimar tu nivel de dominio en cada subtema.</Text>
          <Button label="Empezar a practicar" icon="arrow_forward" onPress={startPracticing} style={styles.stretch} />
        </Card> : progress && <>
          <Card style={styles.summary}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCopy}>
                <Chip label={mastery === null ? 'Sin estimación' : mastery >= 40 ? 'En buen camino' : 'Necesita refuerzo'} icon={mastery === null ? 'info' : mastery >= 40 ? 'trending_up' : 'error'} tone={mastery === null ? 'neutral' : mastery >= 40 ? 'success' : 'warning'} />
                <Text variant="headlineL">{mastery === null ? 'Dominio pendiente' : mastery > 70 ? 'Avanzado' : mastery >= 40 ? 'Intermedio avanzado' : 'Inicial'}</Text>
                <Text variant="bodyM" color="secondary">Has resuelto {progress.course.solvedExerciseCount} ejercicios en este curso.</Text>
              </View>
              <MasteryRing value={mastery} label={mastery === null ? 'Dominio global sin estimación' : `Dominio global ${mastery}%`} size={104} thickness={10}>
                <Text variant="headlineL">{mastery === null ? '—' : `${mastery} %`}</Text><Text variant="labelM" color="secondary">global</Text>
              </MasteryRing>
            </View>
            <View style={styles.practiceStrip}><Icon name="bolt" size="xs" /><Text variant="bodyMBold">{progress.practicedSubtopicCount} de {progress.subtopics.length} subtemas con práctica</Text></View>
          </Card>
          <StatStrip items={[
            { icon: 'menu_book', value: progress.course.solvedExerciseCount, label: 'Ejercicios\nresueltos', tone: 'primary' },
            { icon: 'check_circle', value: mastered.length, label: 'Subtemas\ndominados', tone: 'success' },
            { icon: 'error', value: needsReinforcement, label: 'Para reforzar', tone: 'warning' },
          ]} />
          {progress.focus && <Card style={styles.focus}>
            <View style={styles.row}>
              <IconBox icon="error" size="lg" tone="warning" style={styles.focusIcon} />
              <View style={styles.flex}>
                <View style={styles.focusMeta}><Text variant="bodyMBold" color="warning">Foco prioritario</Text><Text variant="bodyMBold" color="warning">{progress.focus.mastery} % dominio</Text></View>
                <Text variant="title">{progress.focus.subtopicName}</Text>
              </View>
            </View>
            <Text variant="bodyM">{progress.focus.message}</Text>
            <Button label="Reforzar ahora" size="sm" icon="arrow_forward" onPress={() => practice(progress.focus!.subtopicId)} />
          </Card>}
        </>}
        {progress && progress.subtopics.length > 0 && <View style={styles.section}>
          <View style={styles.titleRow}><Text variant="headlineM" isHeading>{hasActivity ? 'Desglose por subtemas' : 'Subtemas del curso'}</Text><Text variant="bodyMBold" color="brand">{plural(progress.subtopics.length, 'unidad', 'unidades')}</Text></View>
          <Card style={styles.subtopics}>{progress.subtopics.map((subtopic, index) => <View key={subtopic.id} style={[styles.subtopic, index > 0 && styles.divider]}>
            {hasActivity ? <MeasuredSubtopic subtopic={subtopic} /> : <View style={styles.row}>
              <IconBox icon={subtopic.icon} size="md" tone="neutral" />
              <Text variant="labelL" style={styles.flex}>{subtopic.name}</Text><Chip label="Sin datos" tone="neutral" />
            </View>}
          </View>)}</Card>
        </View>}
        {hasActivity && progress && mastered.length > 0 && <View style={styles.section}>
          <Text variant="headlineM" isHeading>Subtemas dominados</Text>
          <Card style={styles.mastered}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.masteredTopics} contentContainerStyle={styles.masteredTopicList}>{mastered.map(item => <View key={item.id} style={styles.masteredTopic}>
              <IconBox icon={item.icon} size="xl" tone="success" /><Text variant="bodyM" numberOfLines={2} style={styles.center}>{item.name}</Text>
            </View>)}</ScrollView>
            <View style={styles.masteredCopy}>
              <Text variant="labelL" numberOfLines={3}>¡Ya dominas {mastered.map(item => item.name).join(' y ')}!</Text>
              <Text variant="bodyM" color="secondary">Nivel alto en {mastered.length} de {progress.subtopics.length} subtemas.</Text>
            </View>
          </Card>
        </View>}
      </>}
    </View>
  </ScreenContainer>;
}

function MeasuredSubtopic({ subtopic }: { subtopic: SubtopicProgress }) {
  const level = levelOf(subtopic.mastery);
  const count = subtopic.correctCount === null
    ? plural(subtopic.attemptCount, 'resuelto', 'resueltos')
    : `${subtopic.correctCount}/${subtopic.attemptCount} correctos`;
  return <View style={styles.measured}>
    <View style={styles.row}><IconBox icon={subtopic.icon} size="md" tone={level.tone} />
      <View style={styles.flex}><Text variant="title">{subtopic.name}</Text><Text variant="bodyM" color="secondary">{level.label} · {count}</Text></View>
      <Text variant="title">{subtopic.mastery === null ? '—' : `${subtopic.mastery} %`}</Text>
    </View>
    <ProgressBar value={subtopic.mastery} tone={level.tone} label={`Dominio en ${subtopic.name}`} />
  </View>;
}

const styles = StyleSheet.create({
  stack: { gap: 20 }, heading: { gap: 20 }, titleRow: { minHeight: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  previewLink: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.full, backgroundColor: colors.primarySubtle },
  empty: { padding: 24, borderRadius: 24, alignItems: 'center', gap: 14 }, illustration: { width: 88, height: 88, marginBottom: 0, borderRadius: 24, alignItems: 'center', justifyContent: 'center', experimental_backgroundImage: 'linear-gradient(135deg, #E2E7FF 0%, #DDFBEE 100%)' },
  center: { textAlign: 'center' }, stretch: { alignSelf: 'stretch' },
  summary: { padding: 18, gap: 14, borderRadius: 24, experimental_backgroundImage: 'linear-gradient(110deg, #F0EDFF 0%, #DDFBEE 100%)' },
  summaryRow: { flexDirection: 'row', gap: 12, alignItems: 'center' }, summaryCopy: { flex: 1, gap: 6 }, practiceStrip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.white, borderRadius: radius.full, paddingHorizontal: 10, minHeight: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, flex: { flex: 1, gap: 2 },
  focus: { backgroundColor: '#FFF3E2', padding: 16, gap: 12, borderRadius: 24 }, focusIcon: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.lineDefault }, focusMeta: { flexDirection: 'row', gap: 16, paddingVertical: 5 },
  section: { gap: 20 }, subtopics: { padding: 4, borderRadius: 20 }, subtopic: { padding: 12, minHeight: 64 }, divider: { borderTopWidth: 1, borderTopColor: colors.lineDefault }, measured: { gap: 10 },
  mastered: { padding: 16, gap: 16, borderRadius: 20, minHeight: 126, flexDirection: 'row', alignItems: 'center' }, masteredTopics: { flex: 1.7 }, masteredTopicList: { alignItems: 'center', gap: 16 }, masteredTopic: { alignItems: 'center', gap: 6, width: 88 }, masteredCopy: { flex: 1, gap: 2 },
});
