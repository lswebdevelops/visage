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
      // Adicionado: Invalida o cache de qualquer consulta que fornece a tag 'User'
      // Isso garante que 'getProfile' será re-buscado após o logout.
      invalidatesTags: ['User'],
      // NOVO: Adicionado onQueryStarted para resetar o estado da API após o logout
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; // Espera a mutação de logout ser concluída
          // Reseta todo o estado do RTK Query. Isso limpa o cache de todas as consultas.
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.error("Erro ao fazer logout na API:", err);
          // Em caso de erro na API, ainda é uma boa prática tentar resetar o estado local
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    // Atualizar o perfil do usuário (para o usuário logado)
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`, // URL para atualizar o perfil
        method: 'PUT', // Método PUT para atualizar dados
        body: data,
      }),
    }),

    // Obter o perfil do usuário logado
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`, // URL para obter o perfil do usuário logado
      }),
      // Esta consulta fornece a tag 'User', o que permite que outras mutações a invalidem.
      providesTags: ['User'],
      keepUnusedDataFor: 60, // Mantém os dados por um curto período, ajuste conforme necessário
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
  useProfileMutation,
  useGetProfileQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetEmailsQuery,
} = userApiSlice;
