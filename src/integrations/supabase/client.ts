// Este ficheiro foi modificado para exportar um cliente Supabase mock.
// Em um ambiente de produção, você usaria o cliente Supabase real.

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simula uma sessão inicial e depois não faz mais nada
      setTimeout(() => {
        callback('INITIAL_SESSION', null);
      }, 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signOut: async () => ({ error: null }),
  },
  from: (tableName: string) => ({
    select: () => ({
      eq: (column: string, value: any) => ({
        is: (column2: string, value2: any) => ({
          not: (column3: string, value3: any, value4: any) => ({
            gte: (column5: string, value5: any) => ({
              order: (column6: string, options: { ascending: boolean }) => ({
                data: [],
                error: null,
              }),
            }),
          }),
        }),
      }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => ({ data: { ...data, id: 'mock-id-' + Date.now() }, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => ({ data: { ...data, id: value }, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null,
      }),
    }),
  }),
  functions: {
    invoke: async (functionName: string, options: any) => {
      console.log(`[Mock Supabase Function] Invoked: ${functionName}`, options);
      return { data: { message: `Mock function ${functionName} executed.` }, error: null };
    },
  },
};