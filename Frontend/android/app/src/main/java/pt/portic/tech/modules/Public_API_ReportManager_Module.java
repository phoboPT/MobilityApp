/**
 *  Software disponibilizado no âmbito do projeto TECH pelo PORTIC, Instituto Politécnico do Porto.
 *
 *  Os direitos de autor são exclusivamente retidos pelo PORTIC e pelo Autor mencionado nesta nota,
 *  sendo que qualquer partilha deste código carece de autorização explicita por parte do autor
 *  responsável.
 *
 *  Autor:          Dr.Eng. Francisco Xavier dos Santos Fonseca
 *  Nº da Ordem:    84598
 *  Data:           2021.Dec.06
 *  Email
 *  Institucional:  xavier.fonseca@portic.ipp.pt
 */
/**
 *  Software disponibilizado no âmbito do projeto TECH pelo PORTIC, Instituto Politécnico do Porto.
 *
 *  Os direitos de autor são exclusivamente retidos pelo PORTIC e pelo Autor mencionado nesta nota.
 *  Carece de autorização explicita por parte do autor responsável o uso deste código (1) para fins
 *  que não sejam devidamente definidos na Licença que acompanha este projeto, e (2) para os fins que
 *  própria licença assim o exija.
 *
 *  Autor:          Dr.Eng. Francisco Xavier dos Santos Fonseca
 *  Nº da Ordem:    84598
 *  Data:           2021.Dec.06
 *  Email
 *  Institucional:  xavier.fonseca@portic.ipp.pt
 */
package pt.portic.tech.modules;

public interface Public_API_ReportManager_Module {

    /********************************************************************************
     ***************************** Módulo Report Manager ****************************
     ************ para criação dos relatórios de atividade do utilizador ************
     *
     * Este módulo estará responsável por caracterizar o movimento do utilizador, uma
     * vez por dia, e por produzir um relatório com esta informação, a ser armazenado
     * numa base de dados.
     *
     *
     *******************************************************************************/


    /* Stored as STRING */
    void Begin_Report_Handler_Module();
    void Stop_Report_Handler_Module();
    void CalculateCurrentReport();

    /**
     * When executed, this function verifies if the report service is running.
     * if it is, leave things as they are.
     * if it is not, schedules it.
     */
    void VerifyIfReportServiceIsRunning();
}
