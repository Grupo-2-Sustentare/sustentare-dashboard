// Recursos
import styles from "./Principal.module.css"
import carregarKPIs from "../../utils/carregarKPIs.js"
import carregarGraficos from "../../utils/carregarGraficos.js"
import modoDemonstracao from "../../utils/modoDemonstracao.js"
import mudarTema from "../../utils/mudarTema.js"

// Componentes
import KPI from "../../components/KPI/KPI.jsx"
import Menu from "../../components/SideMenu/SideMenu.jsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import LineChart from '../../components/graficos/CombinedChart';
import DoughnutChart from "../../components/graficos/DoughnutChart"
import BarChart from "../../components/graficos/BarChart"


export default function Principal(){
    // Função que renderiza as KPIs
    var [kpis, setKPIs] = useState();
    function renderizarKPIs(){
        //Traz lista de dicionários com KPIs do back-end
        carregarKPIs().then((valoresKPIs) => {
            //Para cada dicionário, gera uma KPI
            if (valoresKPIs != undefined && valoresKPIs != null){
                var listaKPIs = valoresKPIs.map((valor) => (
                    <KPI key={valor.nome} {...valor} />
                ))
                setKPIs(listaKPIs)
            }
        })

    }

    var [graficoCols, setGraficoCols] = useState()
    var [graficoRosquinha, setGraficoRosc] = useState()
    function renderizarGraficos(){
        carregarGraficos().then((dictDadosGraficos) => {
            setGraficoCols(
                <BarChart 
                    dados={dictDadosGraficos["grafico_colunas"]} 
                />
            )
            setGraficoRosc(
                <DoughnutChart
                    dados={dictDadosGraficos["grafico_rosquinha"]} 
                />
            )
        })
    }

    // Função que atualiza os dados das KPIs e demonstra isso visualmente
    var [loading, setLoading] = useState();
    function atualizarDados(){
        setLoading(<><FontAwesomeIcon icon={"spinner"} className={styles.animarCarregamento}/><p>Buscando dados...</p></>)
            renderizarKPIs()
            renderizarGraficos()

            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()
            modoDemonstracao()

            setTimeout(() => {
                setLoading(<><FontAwesomeIcon icon={"clock-rotate-left"}/><p>Atualizado agora</p></>)
            }, 3000)
            setTimeout(() => {
                setLoading(<><FontAwesomeIcon icon={"clock-rotate-left"}/><p>Atualizado há 30 segundos</p></>)
            }, 27000)
    }
    
    // Datas predefinidas para o período
    var dataAtual = new Date().toISOString().substring(0, 10)
    var inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes = inicioMes.toISOString().substring(0, 10)

    // Define o intervalo para atualização dos dados
    useState(() => {
        atualizarDados()
        const intervalo = setInterval(() => {
            atualizarDados()
        }, 10000);
        return () => clearInterval(intervalo)
    }, [loading])

    // TODO Melhorar
    
    var escuro = false;
    function temaEscuro(){
        mudarTema()
        if(!escuro){
            document.getElementById("grafico1").style = "background-color: white"
            document.getElementById("grafico2").style = "background-color: white"
            escuro = true
        } else {
            document.getElementById("grafico1").style = "background-color: var(--cinza)"
            document.getElementById("grafico2").style = "background-color: var(--cinza)"
            escuro = false
        }
    }

    return (
        <>
            <Menu paginaAtual="principal" />
            <div className="pagina">
                <header>
                    <div>
                        <h2>Painel analítico de estoque</h2>
                        <div>
                            <button className={styles.iconButton}>
                                <FontAwesomeIcon icon={"moon"} onClick={temaEscuro}/>
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className={styles.divPeriodo}>
                            <h4>Período de</h4>
                            <input type="date" defaultValue={inicioMes} required/>
                            <p>à</p>
                            <input type="date" defaultValue={dataAtual}/>
                        </div>
                        <div className={styles.divAtualizacao}>{loading}</div>
                    </div>
                </header>
                <section className={styles.KPIs}>{kpis}</section>
                <section className={styles.graficos}>
                    <span>
                        <div className={styles.divGrafico} id="grafico1">
                            {graficoCols}
                        </div>
                        <div className={styles.divGrafico} id="grafico2">
                            {graficoRosquinha}
                        </div>
                    </span>
                </section>
            </div>
        </>
    )
}