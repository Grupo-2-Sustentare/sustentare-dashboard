import {
    gerarNumeroAleatorio,
    gerarNumerosAleatorios,
    MOCK_ENTRADAS_E_SAIDAS, MOCK_KPI_ENTRADAS, MOCK_KPI_NAO_PLANEJADAS, MOCK_KPI_PERDAS, MOCK_KPI_SAIDAS, MOCK_PRODUTOS,
    MOCK_TIPOS_PERDAS
} from "../../tools/ferramentasDeTeste";
import {get} from "../../tools/api";

async function carregarListasChecaveis(){
    let categorias = []
    let categorias_brutas = await get("categorias")
    if (categorias_brutas !== null){
        // Consumir categorias...
    }

    let produtos = []
    // let produtos_brutos = await get("produtos")
    let produtos_brutos = MOCK_PRODUTOS
    if (produtos_brutos !== null){
        for (let i in produtos_brutos){
            produtos.push(produtos_brutos[i].nome)
        }
    }

    return {
        "categorias": categorias,
        "produtos": produtos
    }
}

async function carregarGraficos(){
    // Entradas e saídas
    // let entradasEhSaidasBrutas = await get("entradasEhSaidas")
    let entradasEhSaidasBrutas = MOCK_ENTRADAS_E_SAIDAS()
    let entradasEhSaidas = null;

    if (entradasEhSaidasBrutas !== null){
        let entradas = []
        let saidas = []
        for (let i in entradasEhSaidasBrutas){
            if (entradasEhSaidasBrutas[i].tipo === "Entradas"){
                entradas = entradasEhSaidasBrutas[i].valores
            } else if (entradasEhSaidasBrutas[i].tipo === "Saídas"){
                saidas = entradasEhSaidasBrutas[i].valores
            }
        }
        if (entradas.length > 0 || saidas.length > 0){
            entradasEhSaidas = [{label: 'Entradas', data: entradas}, {label: 'Saídas', data: saidas}]
        }
    }

    // let perdasBrutas = await get("perdasPorTipo")
    let perdasBrutas = MOCK_TIPOS_PERDAS()
    let perdas = null
    if (perdasBrutas !== null) {
        let tiposPerdas = {
            "validade": [], "extraviado": [], "sumiu": []
        }
        for (let i in perdasBrutas) {
            switch (perdasBrutas[i].tipo) {
                case "validade":
                    tiposPerdas.validade = perdasBrutas[i].data
                    break
                case "extraviado":
                    tiposPerdas.extraviado = perdasBrutas[i].data
                    break
                case "sumiu":
                    tiposPerdas.sumiu = perdasBrutas[i].data
                    break
            }
        }

        if ((tiposPerdas.validade.length > 0) ||
            (tiposPerdas.sumiu.length > 0) ||
            (tiposPerdas.extraviado.length > 0)) {
            perdas = [
                {label: 'Prazo de validade', data: tiposPerdas.validade},
                {label: 'Contaminado ou extraviado', data: tiposPerdas.sumiu},
                {label: 'Não se sabe o paradeiro', data: tiposPerdas.extraviado}
            ]
        }
    }

    let comprasVsUltimaHoraBrutas = await get("compras_vs_ultima_hora")
    let comprasVsUltimaHora = null
    if (comprasVsUltimaHoraBrutas !== null){
        // ...
    }

    return {
        "entradasEhSaidas": entradasEhSaidas,
        "perdas": perdas,
        "comprasVsUltimaHora": comprasVsUltimaHora
    }
}

function carregarKPIs(){
    const METRICAS = {

    }
    let KPIs = {
        "perdas": { "status": "", "quantidade": null},
        "naoPlanejadas": { "status": "", "quantidade": null},
        "valorEntradas": { "status": "", "quantidade": null},
        "valorSaidas": { "status": "", "quantidade": null}
    }
    let kpiPerdasBruta = MOCK_KPI_PERDAS()
    let kpiNaoPlanejadasBruta = MOCK_KPI_NAO_PLANEJADAS()
    let kpiEntradasBruta = MOCK_KPI_ENTRADAS()
    let kpiSaidasBruta = MOCK_KPI_SAIDAS()

    KPIs.perdas.quantidade = kpiPerdasBruta !== null ? kpiPerdasBruta : null
    KPIs.naoPlanejadas.quantidade = kpiNaoPlanejadasBruta !== null ? kpiNaoPlanejadasBruta : null
    KPIs.valorEntradas.quantidade = kpiEntradasBruta !== null ? kpiEntradasBruta : null
    KPIs.valorSaidas.quantidade = kpiSaidasBruta !== null ? kpiSaidasBruta : null

    return KPIs
}

export {carregarListasChecaveis, carregarGraficos, carregarKPIs}