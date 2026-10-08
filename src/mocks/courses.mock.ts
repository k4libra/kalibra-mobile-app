/**
 * Simulated student courses endpoints with sample data taken from the Figma mockups.
 *
 * @remarks
 * The data is only an example: every screen renders whatever courses and subtopics the teacher defines.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CoursesContract } from '@/services/courses.contract';
import type { EnrolledCourse, Student, StudentSubtopic } from '@/types/course';
import { isEmptyScenario, respond } from './scenario';

/**
 * Sample signed-in student.
 */
export const STUDENT: Student = {
  firstName: 'Valentina',
  term: '2025-I',
  avatar: require('@/assets/images/avatar-student.jpg'),
  solvedExerciseCount: 77,
  averageMastery: 71,
  pendingInvitationCount: 1,
};

/**
 * Sample courses of the student.
 */
export const COURSES: EnrolledCourse[] = [
  { id: 'course-2', name: 'Álgebra Lineal', code: 'MA-201', teacherName: 'Ricardo Salas Vega', faculty: 'Facultad de Ingeniería', semester: 'Semestre III', icon: 'grid_on', focus: 'Espacios vectoriales & Transformaciones', mastery: 68, masteredSubtopicCount: 3, subtopicCount: 4, solvedExerciseCount: 21, estimatedTimeLeft: '9h' },
  { id: 'course-1', name: 'Algoritmos y Estructuras de Datos', code: 'CS-204', teacherName: 'Ricardo Salas Vega', faculty: 'Facultad de Ingeniería', semester: 'Semestre IV', icon: 'account_tree', focus: 'Árboles binarios & Recorridos DFS/BFS', mastery: 62, masteredSubtopicCount: 2, subtopicCount: 4, solvedExerciseCount: 42, estimatedTimeLeft: '14h' },
  { id: 'course-3', name: 'Cálculo Multivariable', code: 'MA-301', teacherName: 'Carmen Rojas', faculty: 'Facultad de Ingeniería', semester: 'Semestre V', icon: 'gesture', focus: 'Integrales triples & Campos vectoriales', mastery: 82, masteredSubtopicCount: 3, subtopicCount: 4, solvedExerciseCount: 14, estimatedTimeLeft: '4h' },
  { id: 'course-4', name: 'Física I', code: 'FI-101', teacherName: 'Jorge Medina', faculty: 'Facultad de Ingeniería', semester: 'Semestre I', icon: 'speed', focus: 'Subtemas aún no definidos', mastery: null, masteredSubtopicCount: 0, subtopicCount: 0, solvedExerciseCount: 0, estimatedTimeLeft: '—' },
];

/**
 * Sample subtopics of the courses.
 */
export const SUBTOPICS: StudentSubtopic[] = [
  { id: 'sub-1', courseId: 'course-1', order: 1, name: 'Recursividad y Backtracking', description: 'Pila de llamadas, casos base y ramificación. Domina el retorno ordenado de estados y árboles de decisión.', icon: 'account_tree', mastery: 72, note: '6 ejercicios pendientes' },
  { id: 'sub-2', courseId: 'course-1', order: 2, name: 'Árboles Binarios de Búsqueda', description: 'Recorridos in-order, pre-order e inserción balanceada. Rotaciones de nodos AVL y búsqueda logarítmica.', icon: 'park', mastery: 81, note: '¡Concepto dominado!' },
  { id: 'sub-3', courseId: 'course-1', order: 3, name: 'Programación Dinámica', description: 'Memoización, tabulación y subestructura óptima. Planteamiento de matrices para problemas de optimización.', icon: 'grid_on', mastery: 33, note: '3 errores recientes' },
  { id: 'sub-4', courseId: 'course-1', order: 4, name: 'Grafos y Caminos Mínimos', description: 'Representación matricial y listas de adyacencia. Algoritmos de Dijkstra, Bellman-Ford y búsqueda BFS/DFS.', icon: 'monitoring', mastery: null, note: '10 sesiones interactivas' },
  { id: 'sub-5', courseId: 'course-2', order: 1, name: 'Espacios Vectoriales', description: 'Subespacios, bases y dimensión.', icon: 'grid_on', mastery: 78, note: '4 ejercicios pendientes' },
  { id: 'sub-6', courseId: 'course-2', order: 2, name: 'Transformaciones Lineales', description: 'Núcleo, imagen y matriz asociada.', icon: 'tune', mastery: 74, note: '¡Concepto dominado!' },
  { id: 'sub-7', courseId: 'course-2', order: 3, name: 'Autovalores y Autovectores', description: 'Polinomio característico y diagonalización.', icon: 'functions', mastery: 71, note: '2 ejercicios pendientes' },
  { id: 'sub-8', courseId: 'course-2', order: 4, name: 'Ortogonalidad y Gram-Schmidt', description: 'Producto interno y bases ortonormales.', icon: 'timelapse', mastery: 49, note: '1 error reciente' },
  { id: 'sub-9', courseId: 'course-3', order: 1, name: 'Campos Vectoriales', description: 'Divergencia, rotacional y campos conservativos.', icon: 'gesture', mastery: 88, note: '¡Concepto dominado!' },
  { id: 'sub-10', courseId: 'course-3', order: 2, name: 'Derivadas Parciales', description: 'Gradiente, regla de la cadena y planos tangentes.', icon: 'functions', mastery: 84, note: '¡Concepto dominado!' },
  { id: 'sub-11', courseId: 'course-3', order: 3, name: 'Teoremas Integrales', description: 'Green, Stokes y Gauss.', icon: 'workspace_premium', mastery: 80, note: '¡Concepto dominado!' },
  { id: 'sub-12', courseId: 'course-3', order: 4, name: 'Integrales Triples', description: 'Coordenadas cilíndricas y esféricas.', icon: 'grid_on', mastery: 76, note: '3 ejercicios pendientes' },
];

/**
 * Simulated implementation of {@link CoursesContract}.
 */
export const coursesMock: CoursesContract = {
  getStudent: () => respond(isEmptyScenario() ? { ...STUDENT, solvedExerciseCount: 0, pendingInvitationCount: 1 } : STUDENT),
  listCourses: () => respond(isEmptyScenario() ? [] : COURSES),
  getCourse: courseId => {
    const course = COURSES.find(item => item.id === courseId);
    return course ? respond(course) : Promise.reject(new Error(`Course ${courseId} not found`));
  },
  listSubtopics: courseId => respond(SUBTOPICS.filter(item => item.courseId === courseId)),
};
