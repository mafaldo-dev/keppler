// import { db } from "../../firebaseConfig";
// import { collection } from "firebase/firestore"
// import { Login } from "../../utils/login";

// export const apiRequest = async (
//     endpoint: string,
//     method: 'GET' | 'POST' | 'PUT' | 'DELETE',
//     body?: any,
//     token?: string | any,
// ) => {
//     const url = `http://localhost:3001/${endpoint}`;

//     try {
//         // SALVA NA VARIAVEL HEADERS O FORMATO DA REQUISIÇÃO 
//         const headers: Record<string, string> = {
//             "Content-Type": "application/json",
//         };
//         // FAZ A PASSAGEM DO TOKEN NO HEADERS PRA AUTENTICAÇAO
//         if (token) {
//             headers["Authorization"] = `Bearer ${token}`; // Garante que o token seja enviado corretamente
//         }
//         //DEFINI O QUE VAI SER PASSADO NA REQUISIÇÃO
//         const options: RequestInit = {
//             method,
//             headers,
//         };
// // VERIFICA O METODO QUE ESTA SENDO PASSADO E SO EXIGE BODY CASO ATENDA O QUE FOI SETADO
//         if (body && (method === "POST" || method === "PUT")) {
//             options.body = JSON.stringify(body);
//         }
//         // PEGA A RESPOSTA DA REQUISIÇÃO
//         const response = await fetch(url, options);

// // VERIFICA SI OS ENDPOINTS ESTAO CORRETOS E FUNCIONANDO CASO CONTRARIO RETORNA STATUS 500
//         if (!response.ok) {
//             const errorDetails = await response.text();
//             console.error(`Erro na API (${endpoint}):`, response.status, errorDetails);
//             throw new Error(`Erro na requisição ${endpoint}: ${response.statusText}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error(`Erro ao acessar a API (${endpoint}):`, error);
//         return null;
//     }
// };


// Request information about the logged user in the database

// export const handleLogin = async(username: string, password: string)=> {
//     try {
//         const adminsRef = collection(db, "adm");
        
//         console.log("Logado com sucesso", username)

        
    
//     }catch(exe){
//         //console.error("Erro ao recuperar dados do servidor.")
//         return null
//     }
// }

export {}