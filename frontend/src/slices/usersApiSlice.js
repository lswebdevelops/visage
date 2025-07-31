import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

// Definindo os endpoints para interagir com a API do usuário
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login do usuário
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`, // URL para autenticação do usuário
        method: 'POST', // Método POST para login
        body: data, // Corpo da requisição contendo os dados de login (ex: email e senha)
      }),
      // Após o login, podemos armazenar as informações do usuário
      onQueryStarted: async (data, { dispatch, queryFulfilled }) => {
        try {
          const { data: userInfo } = await queryFulfilled; // Dados do usuário após o login
          // Atualizando o estado global com os dados do usuário logado
          // Note: The `setCredentials` action should handle storing this userInfo
          // If you have `setCredentials` in authSlice, it will handle this.
          // This `updateQueryData` might be redundant or for specific cache invalidation.
          // For now, let's assume `setCredentials` is the primary update mechanism.
        } catch (err) {
          console.error('Erro ao armazenar dados do usuário:', err);
        }
      },
    }),

    // Registro de novo usuário
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`, // URL para registro do usuário
        method: 'POST', // Método POST para criar um novo usuário
        body: data, // Dados do novo usuário (nome, email, senha)
      }),
    }),

    // Logout do usuário
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`, // URL para realizar logout
        method: 'POST', // Método POST para logout
      }),
    }),

    // Atualizar o perfil do usuário (para o usuário logado)
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`, // URL para atualizar o perfil
        method: 'PUT', // Método PUT para atualizar dados
        body: data, 
      }),
    }),

    // *** NOVO: Obter o perfil do usuário logado ***
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`, // URL para obter o perfil do usuário logado
      }),
      // This query should not be cached for too long if user data changes frequently
      // or if it's the primary source of truth for current user data.
      // `providesTags` can be used for invalidation if other mutations affect it.
      providesTags: ['User'], // Tag to invalidate this query if user data changes
      keepUnusedDataFor: 60, // Keep data for a short period, adjust as needed
    }),

    // Obter lista de usuários (Admin)
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL, // URL para obter todos os usuários
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // Deletar um usuário (Admin)
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`, // URL para deletar um usuário específico
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Obter detalhes de um usuário por ID (Admin)
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`, // URL para obter detalhes de um usuário específico
      }),
      keepUnusedDataFor: 5,
    }),

    // Atualizar os dados de um usuário por ID (Admin)
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`, // URL para atualizar o usuário
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Obter uma lista de emails (apenas) (Admin)
    getEmails: builder.query({
      query: () => ({
        url: `${USERS_URL}/email-list`, // URL para obter apenas a lista de emails
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

// Exportando os hooks gerados para uso em componentes React
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation, // Existing hook for PUT /profile
  useGetProfileQuery, // *** NOVO: Hook para GET /profile ***
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetEmailsQuery,
} = userApiSlice;
