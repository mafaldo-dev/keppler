import { collection, getDocs, addDoc, query, where, doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebaseConfig"
import { Employee } from "../../../interfaces"


export async function insertEmployee(employee: Employee) {
  try {
    const docRef = await addDoc(collection(db, "Employee"), employee)
    return docRef.id
  } catch (Exception) {
    console.error("Erro ao realizar cadastro do Colaborador", Exception)
    alert("Erro ao adicionar o COLABORADOR a base de dados!!!")
    throw new Error("Erro interno do servidor!")
  }
}

export async function handleAllEmployee(searchTerm?: string): Promise<Employee[]> {
    try {
        const employeeRef = collection(db, "Employee")
        const snapshot = await getDocs(employeeRef)

        const employee: Employee[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Employee[]
        return employee
    } catch (Exception) {
        console.error("Erro ao recuperar a lista de Funcionarios!", Exception)
        alert("Erro interno do servidor!!!")
        throw new Error("Erro interno do servidor!")
    }
}

export const updatedEmployee = async (id: string, updatedData: any) => {
  try {
    const employeeRef = doc(db, "Employee", id)
    await updateDoc(employeeRef, updatedData)
  } catch (Exception) {
    console.error("Erro ao atualizar os dados do colaborador:", Exception)
    alert("Erro ao atualizar informações do colaborador!!! ")
    throw new Error("Erro interno do servidor!")
  }
}

export async function handleDesignations(designation?: string): Promise<Employee[]> {
  try {
    const employeeRef = collection(db, "Employee")
    
    // Se tiver filtro, monta query com where
    const q = designation
      ? query(employeeRef, where("designation", "==", designation))
      : employeeRef

    const snapshot = await getDocs(q)

    const employees: Employee[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Employee[]

    return employees
  } catch (error) {
    console.error("Erro ao recuperar a lista de Funcionarios!", error)
    alert("Erro interno do servidor!!!")
    throw new Error("Erro interno do servidor!")
  }
}
