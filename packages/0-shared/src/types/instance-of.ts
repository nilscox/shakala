import { ClassType } from './class-type';

export type InstanceOf<Class> = Class extends ClassType<infer Instance> ? Instance : never;
