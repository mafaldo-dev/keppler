import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { Customer } from "../../../interfaces";


export async function insertCustomer(customer: Customer) {
    try {
        const docRef = await addDoc(collection(db, "Customer"), customer)
        console.log("Cliente cadastrado com sucesso, ID: ", docRef.id)
        return docRef.id
    } catch (Exception) {
        console.error("Erro ao inserir o Cliente ao sistema.", Exception)
        alert("Erro ao cadastrar cliente!!!")
        throw new Error()
    }
}

export async function updateCustomer(id: string, updatedData: any) {
    try {
        const customerRef = doc(db, "Customer", id)
        await updateDoc(customerRef, updatedData)
    } catch (Exception) {
        console.error("Erro ao atualizar os dados do cliente!", Exception)
        alert("Erro ao atualizar informações do cliente!")
        throw new Error()
    }
}

export async function handleAllCustomer(searchTerm?: string): Promise<Customer[]> {
    try {
        const clientRef = collection(db, "Customer")
        const snapshot = await getDocs(clientRef)

        const clients: Customer[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Customer[]
        return clients
    } catch (Exception) {
        console.error("Erro ao recuperar a lista de Clientes!", Exception)
        alert("Erro interno do servidor!!!")
        throw new Error()
    }
}