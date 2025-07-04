import { useState, useEffect } from "react"
import { useForm, SubmitHandler } from 'react-hook-form'
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "../../../firebaseConfig"
import { Products, Movement } from "../../../service/interfaces"

import Dashboard from "../../../components/dashboard/Dashboard"

import { insertProduct, updateProduct } from "../../../service/api/products"
import { getAllProducts } from "../../../service/api/products/index"
import { getKardexMovements } from "../../../service/api/kardex"

import lupa from "../../../assets/image/search.png"
import { useSystemStatus, StatusMessageType } from "../../../SystemStatusContext"

const SearchProducts = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Products>()

  const [modalOpen, setIsModalOpen] = useState<boolean>(false)
  const [openRegister, setOpenRegister] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [render, setRender] = useState<Products[]>([])
  const [error, setError] = useState<string | null>(null)
  const [newInfos, setNewInfos] = useState<Products>()
  const [items, setItem] = useState<Products[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filter, setFilter] = useState<Products[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  const [movements, setMovements] = useState<Movement[]>([])
  const [kardex, setKardex] = useState<boolean>(false)
  
  const { addMessage } = useSystemStatus();
  // Atualize handleKardex:
  const handleOpenKardex = async (product: Products) => {
    try {
      const movements = await getKardexMovements(product.id);
      setSelectedProduct(product);
      setMovements(movements);
      setKardex(true);
    } catch (error) {
      console.error("Erro ao abrir o Kardex:", error);
      alert("Erro ao abrir o Kardex");
    }
  };


  // REGISTER ITENS IN DATABASE
  const onSubmit: SubmitHandler<Products> = async (data) => {
    try {
      await insertProduct({ ...data, addedAt: new Date() })
      reset()
      const reload = await getAllProducts()

      alert("Produto adicionado com sucesso!")
      setRender(reload)
      setOpenRegister(false)
    } catch (Exception) {
      console.error("Erro ao adicionar Item", Exception)
      alert("Erro ao adicionar novo produto.")
      throw new Error("Erro ao cadastrar o produto!")
    }
  }
  // RENDER ITENS REGISTERED IN DATABASE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const produtos = await getAllProducts()
        setRender(produtos)
        //addMessage(StatusMessageType.ERROR, "Este é um erro de teste", "Detalhes do erro aqui");
      } catch (Exception) {
        console.error("Erro ao recuperar a lista de produtos.", Exception)
        setError("Erro ao buscar produtos")
        throw new Error("Erro ao recuperar a lista de produtos!")
      } finally {
        setLoading(false)
      }
    };
    fetchProducts()
  }, [])

  // PERMITE ATUALIZAR OS DADOS PARCIALMENTE
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInfos((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }
  // FUNÇAO PRA SALVAR OS NOVOS DADOS DO PRODUTO
  const saveUpdate = async () => {
    if (!newInfos || !newInfos.id) {
      alert("ID do produto não encontrado!")
      return
    }
    try {
      await updateProduct(newInfos.id, {
        name: newInfos.name,
        description: newInfos.description,
        quantity: newInfos.quantity,
        price: newInfos.price,
        code: newInfos.code,
        fornecedor: newInfos.supplier
      })
      alert("Produto atualizado com sucesso!")
      setIsModalOpen(false)
      const reload = await getAllProducts()
      setFilter(reload)
    } catch (Exception) {
      console.error("Erro ao atualizar os dados do Produto", Exception)
      alert("Erro ao atualizar os dados do Produto!")
      throw new Error("Erro ao atualizar os dados produto!")
    }
  }
  // ABRE O MODAL PARA EDIÇÃO DE PRODUTOS
  const handleEdit = (product: Products) => {
    console.log(product)
    setNewInfos(product)
    setIsModalOpen(true)
  }
  // DELETE ITEM
  async function handleDelete(id: any) {
    try {
      await deleteDoc(doc(db, "Estoque", id))
      setItem(items.filter(product => product.id !== id));
      alert("Produto deletado com sucesso!");
      const reload = await getAllProducts()
      setRender(reload)
    } catch (Exception) {
      console.error("Erro ao deletar produto: ", Exception);
      alert("Erro ao deletar produto, tente novamente.");
      throw new Error("Erro ao deletar o produto")
    }
  }
  // FILTRO COMEÇA AQUI
  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilter(filtered)
    } else {
      setFilter(items)
    }
  }, [searchTerm, items])

  const handleProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllProducts(searchTerm)
      setItem(res)
      setFilter(res)

    } catch (Exception) {
      console.error("Erro ao buscar Item:", Exception)
      alert("Erro ao recuperar informações do item!")
      throw new Error("Erro ao recuperar o Produto indicado!")
    }
  }
  useEffect(() => {
    handleProducts()
  }, [])
  // TERMINA AQUI

  return (
    <Dashboard>
      <div className="w-full flex flex-col items-center m-auto p-4">
        <h1 className="text-2xl text-center font-bold mb-12">Gerenciar Produtos</h1>
        <div className="flex justify-between items-center mr-2 mb-1 w-full">
          <div className="flex flex-col mb-3 cursor-pointer hover:zoonIn">
            <span className="ml-1">Novo produto</span>
            <button
              onClick={() => setOpenRegister(true)}
              className="font-semibold pb-1 ml-1 text-2xl border-gray-400 border text-gray-400 rounded-sm w-26 cursor-pointer"
            > + </button>
          </div>
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome o do produto"
              className="p-2 w-74 bg-gray-100 border-gray-400 rounded h-10 border mr-1"
            />
            <img
              className="bg-gray-100 border-gray-400 rounded-r p-1 -ml-2 h-10 cursor-pointer border"
              src={lupa || "/placeholder.svg"}
              alt=""
            />
          </div>
        </div>
        {loading ? (<p>Carregando...</p>) : error ? (<p>{error}</p>)
          : (
            <div className="w-full border border-gray-300 rounded">
              {/* Cabeçalho da Tabela */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="h-10 px-4 text-left font-medium text-gray-700">Código</th>
                      <th className="h-10 px-4 text-left font-medium text-gray-700">Nome</th>
                      <th className="h-10 px-4 text-left font-medium text-gray-700">Preço</th>
                      <th className="h-10 px-4 text-left font-medium text-gray-700">Quantidade</th>
                      <th className="h-10 px-4 text-left font-medium text-gray-700">Fornecedor</th>
                      <th className="h-10 px-4 text-left font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Corpo da Tabela com Scroll */}
                    {filter.length > 0 ? (
                      filter.map((item) => (
                        <tr className="border-b cursor-pointer border-gray-200 hover:bg-gray-50" key={item.id}>
                          <td className="p-4 text-gray-900">{item.code}</td>
                          <td className="p-4 text-gray-900 ">{item.name}</td>
                          <td className="p-4 text-gray-900">R$ {item.price}</td>
                          <td className="p-4 text-gray-900">{item.quantity}</td>
                          <td className="p-4 text-gray-900">{item.supplier}</td>
                          <td className="p-1">
                            <div className="flex gap-1 -ml-6">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleEdit(item.id)}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >Editar</button>

                                <button
                                  onClick={() => handleDelete(item.id!)}
                                  className="text-red-600 hover:text-red-900"
                                >Excluir</button>
                                {/* <button
                                className="px-2 py-3 font-bold bg-gray-200 h-2 flex items-center rounded-sm"
                                onClick={() => handleOpenKardex(item)}
                              >
                                <span className="mb-2 py-4 text-lg">...</span>
                              </button> */}
                              </td>
                            </div>
                          </td>
                        </tr>

                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          Nenhum produto encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
      <div className="flex justify-start ml-4 gap-2">
        <a
          className="bg-white hover:bg-cyan-500 hover:text-white font-semibold text-gray-500 border border-gray-400 font-semibold p-2 rounded-lg w-24 text-center" href="/dashboard">
          Voltar </a>
      </div>
      {modalOpen && newInfos && (
        <>
          <div className="modal">
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
                <input
                  type="text"
                  name="name"
                  value={newInfos.name}
                  onChange={handleChange}
                  placeholder="Nome do produto"
                  className="w-full border p-2 mb-2 rounded"
                />
                <input
                  type="text"
                  name="description"
                  value={newInfos.description}
                  onChange={handleChange}
                  placeholder="description"
                  className="w-full border p-2 mb-2 rounded"
                />
                <input
                  type="text"
                  name="quantity"
                  value={newInfos.quantity}
                  onChange={handleChange}
                  placeholder="Quantidade"
                  className="w-full border p-2 mb-2 rounded"
                />
                <input
                  name="price"
                  value={newInfos.price}
                  onChange={handleChange}
                  placeholder="Descrição da vaga"
                  className="w-full border p-2 mb-2 rounded h-20"
                />
                <input
                  name="code"
                  value={newInfos.code}
                  onChange={handleChange}
                  placeholder="Codigo"
                  className="w-full border p-2 mb-2 rounded h-20"
                />
                <input
                  name="fornecedor"
                  value={newInfos.supplier}
                  onChange={handleChange}
                  placeholder="Fornecedor"
                  className="w-full border p-2 mb-2 rounded h-20"
                />
                <div className="flex justify-between">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => setIsModalOpen(false)}>
                    Cancelar</button>
                  <button
                    onClick={saveUpdate}
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                    Salvar</button>
                </div>
              </div>
            </div>
            <button onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </>
      )}
      {openRegister ? (
        <>
          <div className="fixed inset-0 bg-black/50 z-40"></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[600px] max-w-[90vw] z-50 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="relative mb-6">
                <h2 className="text-2xl font-semibold mb-2">Cadastrar Produto</h2>
                <p className="text-gray-600">Preencha os campos abaixo para cadastrar um novo produto.</p>
                <button
                  onClick={() => setOpenRegister(false)}
                  className="cursor-pointer absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl"
                >&times; </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-medium">Nome</label>
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    {errors.name && <span className="text-red">O campo nome e obrigatorio</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="font-medium">Descrição</label>
                    <textarea
                      {...register("description", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[80px] resize-y"
                      rows={3}
                    />
                    {errors.description && <span className="text-red">Adicione uma descrição ao produto requerido</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="quantity" className="font-medium">Quantidade</label>
                    <input
                      type="number"
                      {...register("quantity", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    {errors.quantity && <span className="color-red-500">O campo quantidade e requerido</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="price" className="font-medium">Preço</label>
                    <input
                      type="number"
                      {...register("price", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    {errors.price && <span className="color-red-500">O campo preço e obrigatorio</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="code" className="font-medium">Código</label>
                    <input
                      type="number"
                      {...register("code", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      required
                    />
                    {errors.code && <span className="color-red-500">Insira um codigo ao produto requerido</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="code" className="font-medium">Fornecedor</label>
                    <input
                      type="text"
                      {...register("supplier", { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      required
                    />
                    {errors.supplier && <span className="color-red-500">Vincule o produto a um fornecedor!!! requerido</span>}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setOpenRegister(false)}
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  > Cancelar</button>
                  <button
                    type="submit"
                    className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                  > Salvar</button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {kardex && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-5xl shadow-lg relative max-h-[90vh] overflow-y-auto">

            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500"
              onClick={() => {
                setKardex(false);
                setSelectedProduct(null);
                setMovements([]);
              }}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Kardex - {selectedProduct.name}
            </h2>

            <div className="mb-4 text-sm">
              <p><strong>Código:</strong> {selectedProduct.code}</p>
              <p><strong>Saldo Atual:</strong> {selectedProduct.quantity}</p>
            </div>

            <table className="w-full border border-gray-300 rounded text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-2 text-left">Data</th>
                  <th className="p-2 text-left">Tipo</th>
                  <th className="p-2 text-left">Produto</th>
                  <th className="p-2 text-left">Código</th>
                  <th className="p-2 text-left">Quantidade</th>
                  <th className="p-2 text-left">NF</th>
                  <th className="p-2 text-left">Usuário</th>
                </tr>
              </thead>
              <tbody>
                {movements.length > 0 ? (
                  movements.map((mov: Movement) => (
                    <tr key={mov.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {new Date(mov.date?.seconds * 1000).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2 capitalize">{mov.type}</td>
                      <td className="p-2">{selectedProduct.name}</td>
                      <td className="p-2">{selectedProduct.code}</td>
                      <td className="p-2">{mov.quantity}</td>
                      <td className="p-2">{mov.nfNumber}</td>
                      <td className="p-2">{mov.user || 'Sistema'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Nenhuma movimentação encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Dashboard>
  )
}

export default SearchProducts

