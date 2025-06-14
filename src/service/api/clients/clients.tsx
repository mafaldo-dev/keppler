import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"
import { Clients } from "../../interfaces/clients"


export async function insertClient(client: Clients) {
    try {
        const docRef = await addDoc(collection(db, "Clients"), client)
        console.log("Cliente cadastrado com sucesso, ID: ", docRef.id)
        return docRef.id
    } catch (Exception) {
        console.error("Erro ao inserir o Cliente ao sistema.", Exception)
        alert("Erro ao cadastrar cliente!!!")
        throw new Error
    }
}

export async function updateClient(id: string, updatedData: any) {
    try {
        const clientRef = doc(db, "Clients", id)
        await updateDoc(clientRef, updatedData)
        console.log("Dados atualizados com sucesso!")
    } catch (Exception) {
        console.error("Erro ao atualizar os dados do cliente!", Exception)
        alert("Erro ao atualizar informações do cliente!")
        throw new Error
    }
}

export async function getAllClients(searchTerm?: string): Promise<Clients[]> {
    try {
        const clientRef = collection(db, "Clients")
        const snapshot = await getDocs(clientRef)

        const clients: Clients[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Clients[]
        return clients
    } catch (Exception) {
        console.error("Erro ao recuperar a lista de Clientes!", Exception)
        alert("Erro interno do servidor!!!")
        throw new Error
    }
}