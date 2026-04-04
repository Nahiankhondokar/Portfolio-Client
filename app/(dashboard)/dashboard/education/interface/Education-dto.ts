// // types/Experience-dto.ts
// export type ExperienceDto = {
//     title: string;
//     company?: string | null;
//     duration?: string | null;
//     position?: string | null;
//     start_date?: string | null;
//     end_date?: string | null;
//     description?: string | null;
//     image?: File | null;
// };
//
//
// /**
//  * Form → API (FormData)
//  */
// export const toFormData = (values: ExperienceDto) => {
//     const fd = new FormData();
//
//     Object.entries(values).forEach(([key, value]) => {
//         if (value !== "" && value !== null && value !== undefined) {
//             fd.append(key, value);
//         }
//     });
//
//     return fd;
// };