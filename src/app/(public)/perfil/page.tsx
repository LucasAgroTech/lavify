"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  Car,
  Plus,
  ChevronRight,
  LogOut,
  HelpCircle,
  Loader2,
  CircleUser,
} from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
}

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string | null;
  cor: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddVeiculo, setShowAddVeiculo] = useState(false);
  const [novoVeiculo, setNovoVeiculo] = useState({ placa: "", modelo: "", cor: "" });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetchDados();
  }, []);

  async function fetchDados() {
    try {
      const [clienteRes, veiculosRes] = await Promise.all([
        fetch("/api/cliente/auth/me"),
        fetch("/api/cliente/veiculos"),
      ]);

      if (clienteRes.status === 401) {
        router.push("/entrar");
        return;
      }

      if (clienteRes.ok) setCliente(await clienteRes.json());
      if (veiculosRes.ok) setVeiculos(await veiculosRes.json());
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/cliente/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleAddVeiculo(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
      const res = await fetch("/api/cliente/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoVeiculo),
      });

      if (res.ok) {
        const veiculo = await res.json();
        setVeiculos([...veiculos, veiculo]);
        setShowAddVeiculo(false);
        setNovoVeiculo({ placa: "", modelo: "", cor: "" });
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <CircleUser className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Faça login para ver seu perfil
        </h2>
        <p className="text-slate-500 text-sm mb-6">Acesse sua conta para continuar</p>
        <Link
          href="/entrar"
          className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl"
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 lg:max-w-2xl lg:mx-auto">
      {/* Header */}
      <h1 className="text-xl font-bold text-slate-900 mb-4">Meu Perfil</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {cliente.nome.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">{cliente.nome}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="truncate">{cliente.email}</span>
            </div>
            {cliente.telefone && (
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-0.5">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{cliente.telefone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Veículos */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-4">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-slate-900">Meus Veículos</h2>
          </div>
          <button
            onClick={() => setShowAddVeiculo(!showAddVeiculo)}
            className="flex items-center gap-1 text-sm text-white bg-cyan-500 font-bold px-3 py-1.5 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        {/* Add Form */}
        {showAddVeiculo && (
          <form onSubmit={handleAddVeiculo} className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Placa (ex: ABC1234)"
                value={novoVeiculo.placa}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value.toUpperCase() })}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm uppercase font-mono focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Modelo (ex: Honda Civic)"
                value={novoVeiculo.modelo}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Cor (opcional)"
                value={novoVeiculo.cor}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, cor: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setShowAddVeiculo(false)}
                className="flex-1 py-3 text-slate-600 font-bold rounded-xl border-2 border-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 py-3 bg-cyan-500 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}

        {veiculos.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Car className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Nenhum veículo cadastrado</p>
            <p className="text-slate-400 text-sm mt-1">Adicione seu primeiro veículo</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {veiculos.map((veiculo) => (
              <div key={veiculo.id} className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Car className="w-6 h-6 text-slate-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{veiculo.modelo}</p>
                  <p className="text-sm text-slate-600">
                    <span className="font-mono font-bold">{veiculo.placa}</span>
                    {veiculo.cor && <span className="text-slate-400"> • {veiculo.cor}</span>}
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <Link
          href="/ajuda"
          className="flex items-center gap-4 p-4 border-b border-slate-100 active:bg-slate-50"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-slate-700" />
          </div>
          <span className="flex-1 font-semibold text-slate-900">Ajuda</span>
          <ChevronRight className="w-6 h-6 text-slate-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 active:bg-red-50"
        >
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="font-semibold text-red-600">Sair da conta</span>
        </button>
      </div>
    </div>
  );
}
