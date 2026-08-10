import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courseContent } from '../../../../../seed-data/course-content';
import { requireRole } from '@/lib/auth';

/**
 * Restore the pedagogical course catalogue from the versioned source data.
 *
 * This endpoint is deliberately idempotent: existing courses/modules are
 * matched by their stable business keys (title + country, title + course)
 * rather than recreated on every run.
 */
export async function POST() {
  const { error } = await requireRole('admin');
  if (error) return error;

  try {
    let coursesCreated = 0;
    let coursesUpdated = 0;
    let modulesCreated = 0;
    let modulesUpdated = 0;

    for (const sourceCourse of courseContent) {
      const existingCourse = await db.course.findFirst({
        where: {
          title: sourceCourse.title,
          countryCode: 'FR',
        },
      });

      const course = existingCourse
        ? await db.course.update({
            where: { id: existingCourse.id },
            data: {
              description: sourceCourse.description,
              category: sourceCourse.category,
              level: sourceCourse.level,
              duration: sourceCourse.duration,
              icon: sourceCourse.icon,
              isPremium: sourceCourse.isPremium,
            },
          })
        : await db.course.create({
            data: {
              id: sourceCourse.id,
              title: sourceCourse.title,
              description: sourceCourse.description,
              category: sourceCourse.category,
              level: sourceCourse.level,
              duration: sourceCourse.duration,
              order: courseContent.indexOf(sourceCourse),
              icon: sourceCourse.icon,
              isPremium: sourceCourse.isPremium,
              countryCode: 'FR',
            },
          });

      if (existingCourse) coursesUpdated++;
      else coursesCreated++;

      for (const [moduleIndex, sourceModule] of sourceCourse.modules.entries()) {
        const existingModule = await db.module.findFirst({
          where: {
            courseId: course.id,
            title: sourceModule.title,
          },
        });

        if (existingModule) {
          await db.module.update({
            where: { id: existingModule.id },
            data: {
              content: sourceModule.content,
              type: sourceModule.type,
              duration: sourceModule.duration,
              order: moduleIndex,
            },
          });
          modulesUpdated++;
        } else {
          await db.module.create({
            data: {
              id: sourceModule.id,
              courseId: course.id,
              title: sourceModule.title,
              content: sourceModule.content,
              type: sourceModule.type,
              duration: sourceModule.duration,
              order: moduleIndex,
            },
          });
          modulesCreated++;
        }
      }
    }

    const courses = await db.course.count({ where: { countryCode: 'FR' } });
    const modules = await db.module.count({
      where: { course: { countryCode: 'FR' } },
    });

    return NextResponse.json({
      ok: true,
      sourceCourses: courseContent.length,
      coursesCreated,
      coursesUpdated,
      modulesCreated,
      modulesUpdated,
      totalCoursesFR: courses,
      totalModulesFR: modules,
    });
  } catch (error) {
    console.error('[seed/courses] failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Impossible de restaurer les contenus des cours' },
      { status: 500 },
    );
  }
}
