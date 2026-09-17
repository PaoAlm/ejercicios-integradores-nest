import * as bcrypt from 'bcrypt';

type CategoriasValidas = 'programacion' | 'diseno' | 'negocios' | 'datos';
type EstadosValidos = 'en_progreso' | 'completado';

interface SeedCursos {
    id: string;
    titulo: string;
    descripcion: string;
    categoria: CategoriasValidas;
    duracionHoras: number;
    activo: boolean;
}

interface SeedEstudiantes {
    id: string;
    nombreCompleto: string;
    email: string;
    password: string;
    roles: string[];
    isActive: boolean;
}

interface SeedInscripciones {
    estudianteId: string;
    cursoId: string;
    progreso: number;
    estado: EstadosValidos;
    fechaInscripcion: Date;
    fechaCompletado: Date | null;
}

interface SeedLogros {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
}

interface SeedData {
    cursos: SeedCursos[];
    estudiantes: SeedEstudiantes[];
    inscripciones: SeedInscripciones[];
    logros: SeedLogros[];
}



const CURSOS_IDS = {
    REACT: 'b823e59a-9860-4e4b-972a-463836173a7c',
    UX: 'c59828fa-6839-4d6b-9c98-18e38f9b9f71',
    DATA: 'f8a5a8e3-85f0-466d-9781-64ebdb49c719'
};

const ESTUDIANTES_IDS = {
    PAOLA: '3f2524a1-0b14-4f53-bdae-7d946ba66023',
    ANA: 'd9b4b39e-2a6d-4951-8931-df13b2de9c1a',
    CARLOS: 'e52c8b05-9e8c-4f72-965a-0d8c281e5b8e',
    LUCIA: 'f19d0840-7e1f-4b08-b80c-7b243400518f',
    ROBERTO: 'a0f7c231-1e9a-4c8f-9a00-1c390238e83b',
    ELENA: 'c64b73b5-3d84-4863-8a3d-4c3e8e29a910'
};

export const initialData: SeedData = {
    cursos: [
        {
            id: CURSOS_IDS.REACT,
            titulo: 'React de cero a experto',
            descripcion: 'Aprende React moderno creando aplicaciones reales.',
            categoria: 'programacion',
            duracionHoras: 45,
            activo: true
        },
        {
            id: CURSOS_IDS.UX,
            titulo: 'UX/UI para Principiantes',
            descripcion: 'Fundamentos de diseño de interfaces y experiencia de usuario.',
            categoria: 'diseno',
            duracionHoras: 20,
            activo: true
        },
        {
            id: CURSOS_IDS.DATA,
            titulo: 'Data Science con Python',
            descripcion: 'Análisis de datos, machine learning y visualización.',
            categoria: 'datos',
            duracionHoras: 60,
            activo: true
        }
    ],
    estudiantes: [
        {
            id: ESTUDIANTES_IDS.PAOLA,
            nombreCompleto: 'Paola Almonte',
            email: 'paola@ejemplo.com',
            password: bcrypt.hashSync('Password123!', 10),
            roles: ['admin'],
            isActive: true
        },
        {
            id: ESTUDIANTES_IDS.ANA,
            nombreCompleto: 'Ana García',
            email: 'ana.garcia@ejemplo.com',
            password: bcrypt.hashSync('Password123!', 10),
            roles: ['student'],
            isActive: true
        },
        {
            id: ESTUDIANTES_IDS.CARLOS,
            nombreCompleto: 'Carlos Mendoza',
            email: 'carlos.mendoza@ejemplo.com',
            password: bcrypt.hashSync('Password123!', 10),
            roles: ['student'],
            isActive: true
        },
        {
            id: ESTUDIANTES_IDS.LUCIA,
            nombreCompleto: 'Lucía Fernández',
            email: 'lucia.fernandez@ejemplo.com',
            password: bcrypt.hashSync('Password123!', 10),
            roles: ['student'],
            isActive: false
        },
        {
            id: ESTUDIANTES_IDS.ROBERTO,
            nombreCompleto: 'Roberto Silva',
            email: 'roberto.silva@ejemplo.com',
            password: bcrypt.hashSync('Password123!', 10),
            roles: ['student', 'admin'],
            isActive: true
        },
        {
            id: ESTUDIANTES_IDS.ELENA,
            nombreCompleto: 'Elena Torres',
            email: 'elena.torres@ejemplo.com',
            password: bcrypt.hashSync('Password123!', 10),
            roles: ['student'],
            isActive: true
        }
    ],
    inscripciones: [
        {
            cursoId: CURSOS_IDS.REACT,
            estudianteId: ESTUDIANTES_IDS.ANA,
            progreso: 45,
            estado: 'en_progreso',
            fechaInscripcion: new Date('2023-01-15T10:00:00Z'),
            fechaCompletado: null
        },
        {
            cursoId: CURSOS_IDS.REACT,
            estudianteId: ESTUDIANTES_IDS.CARLOS,
            progreso: 100,
            estado: 'completado',
            fechaInscripcion: new Date('2022-11-01T08:30:00Z'),
            fechaCompletado: new Date('2022-12-20T16:45:00Z')
        },
        {
            cursoId: CURSOS_IDS.UX,
            estudianteId: ESTUDIANTES_IDS.ELENA,
            progreso: 10,
            estado: 'en_progreso',
            fechaInscripcion: new Date('2023-10-05T14:20:00Z'),
            fechaCompletado: null
        },
        {
            cursoId: CURSOS_IDS.DATA,
            estudianteId: ESTUDIANTES_IDS.ROBERTO,
            progreso: 100,
            estado: 'completado',
            fechaInscripcion: new Date('2023-02-10T09:00:00Z'),
            fechaCompletado: new Date('2023-04-15T11:20:00Z')
        }
    ],

    logros: [
        {
            id: '',
            codigo: 'PRIMEROS_PASOS',
            nombre: 'Primeros Pasos',
            descripcion: 'Completar al menos 1 curso.'
        },
        {
            id: '',
            codigo: 'EXPLORADOR ',
            nombre: 'Explorador',
            descripcion: 'Completar cursos de al menos 3 categorías distintas'
        },
        {
            id: '',
            codigo: 'MARATONISTA',
            nombre: 'Maratonista',
            descripcion: 'Completar cursos cuya duración sumada sea de al menos 20 horas.'
        }
    ]
};