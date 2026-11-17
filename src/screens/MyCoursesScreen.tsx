import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { EnrolledCourseCard, QuickPracticeCard } from '@/components/courses';
import { AppHeader, ScreenContainer } from '@/components/layout';
import { Card, Chip, EmptyState, ErrorState, Icon, LoadingState, ProgressBar, SectionTitle, StatStrip, Text } from '@/components/ui';
import { useMyCourses } from '@/hooks/useMyCourses';
import { useRootNavigation } from '@/navigation/useRootNavigation';
import { colors, gradients } from '@/theme/tokens';

export function MyCoursesScreen() {
  const navigation = useRootNavigation();
  const { student, courses, featuredCourse, quickPractice, isLoading, error, refetch } = useMyCourses();
  const hasCourses = courses.length > 0;
  const openCourse = (courseId: string) => navigation.navigate('CourseSubtopics', { courseId });
  const openInvitations = () => navigation.navigate('Invitations');
  return <ScreenContainer variant="courses" refreshing={isLoading} onRefresh={refetch}
    header={<AppHeader avatar={student?.avatar} greeting={`Hola, ${student?.firstName ?? ''}`}
      subtitle={hasCourses || isLoading ? 'Tus cursos activos este ciclo' : 'Aún no tienes cursos este ciclo'}
      onNotifications={openInvitations} notificationCount={student?.pendingInvitationCount}
      onProfile={() => navigation.navigate('Tabs', { screen: 'Profile' })} />}>
    <View style={styles.row}><Text variant="title" isHeading>Resumen del ciclo</Text><Chip label={student?.term ? `Ciclo ${student.term}` : 'Ciclo actual'} icon="calendar_month" tone="neutral" /></View>
    {error && <ErrorState message={error} />}
    {isLoading ? <LoadingState /> : <>
      {hasCourses && <StatStrip items={[
        { icon: 'menu_book', value: student?.solvedExerciseCount ?? 0, label: 'Ejercicios\nresueltos' },
        { icon: 'target', value: student?.averageMastery === null || student?.averageMastery === undefined ? '—' : `${student.averageMastery}%`, label: 'Dominio promedio', tone: 'success' },
        { icon: 'layers', value: courses.length, label: 'Cursos activos', tone: 'warning' },
      ]} />}
      {hasCourses && featuredCourse && <>
        <Text variant="headlineM" isHeading>Continúa donde te quedaste</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Continuar práctica" onPress={() => openCourse(featuredCourse.id)}>
          <Card style={styles.featured}><View style={styles.featuredIcon}><Icon name={featuredCourse.icon} size="3xl" color={colors.white} /></View>
            <View style={styles.copy}><Chip label={featuredCourse.solvedExerciseCount > 0 ? 'En práctica' : 'Por comenzar'} icon="bolt" tone="success" />
              <Text variant="title">{featuredCourse.name}</Text>
              <View style={styles.progress}><View style={styles.flex}><ProgressBar value={featuredCourse.mastery} label={`Dominio en ${featuredCourse.name}`} height={8} /></View><Text variant="bodyMBold" color="brand">{featuredCourse.mastery === null ? '—' : `${featuredCourse.mastery} %`}</Text></View>
              <View style={styles.meta}><Icon name="check_circle" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary">{featuredCourse.masteredSubtopicCount}/{featuredCourse.subtopicCount} temas dominados</Text></View>
              <View style={styles.meta}><Icon name="menu_book" size="xs" color={colors.contentSecondary} /><Text variant="bodyM" color="secondary">{featuredCourse.solvedExerciseCount} ejercicios</Text></View>
            </View></Card>
        </Pressable>
        <QuickPracticeCard onPress={() => {
          if (quickPractice) navigation.navigate('Exercise', quickPractice);
          else openCourse(featuredCourse.id);
        }} />
      </>}
      <View style={styles.section}><SectionTitle title="Cursos inscritos" caption={`${courses.length} en curso`} />
        {hasCourses ? courses.map(course => <EnrolledCourseCard key={course.id} course={course} onContinue={openCourse} />)
          : <EmptyState icon="school" actionVariant="primary" actionIcon="mail" title="Aún no estás inscrito en ningún curso"
            description="Tu docente te enviará una invitación a tu correo registrado. Acéptala para empezar a practicar."
            actionLabel={`Ver invitaciones (${student?.pendingInvitationCount ?? 0})`} onAction={openInvitations} />}
      </View>
    </>}
  </ScreenContainer>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  section: { gap: 20 }, featured: { minHeight: 168, flexDirection: 'row', alignItems: 'center', gap: 14 },
  featuredIcon: { width: 82, height: 84, borderRadius: 16, experimental_backgroundImage: gradients.primary, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 4 }, meta: { flexDirection: 'row', gap: 4, alignItems: 'center' }, progress: { flexDirection: 'row', gap: 8, alignItems: 'center' }, flex: { flex: 1 } });
