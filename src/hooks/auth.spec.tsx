// import { renderHook, act } from '@testing-library/react-hooks'
// import { AuthProvider, useAuth } from './auth';

// jest.mock('expo-google-app-auth', () => {
//   return {
//     logInAsync: () => {
//       return {
//         type: 'success',
//         user: {
//           id: 'any_id',
//           email: 'matheus10.rk@gmail.com',
//           name: 'Matheus',
//           photo: 'any_photo.png',
//         }
//       }
//     }
//   }
// });

// describe('Auth Hook', () => {
//   it('should be able to sign in with an existing Google account', async () => {
//     const { result } = renderHook(() => useAuth(), {
//       wrapper: AuthProvider
//     });

//     await act(() => result.current.signInWithGoogle());

//     expect(result.current.user.email).toBe('matheus10.rk@gmail.com'); 
//   });
// });