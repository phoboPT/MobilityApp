/**
 *  Software disponibilizado no âmbito do projeto TECH pelo PORTIC, Instituto Politécnico do Porto.
 *
 *  Os direitos de autor são exclusivamente retidos pelo PORTIC, e qualquer partilha
 *  deste código carece de autorização explicita por parte do autor responsável.
 *
 *  Autor:      Dr.Eng. Francisco Xavier dos Santos Fonseca
 *  Nº Ordem:   84598
 *  Data:       2021.Nov.10
 *  Email:      xavier.fonseca@portic.ipp.pt
 */

package pt.portic.tech.modules;

public interface Public_API_HAR_Module {

    /********************************************************************************
     *********************** Módulo Human Activity Recognition **********************
     *******************************************************************************/

    /**
     * Begin recognizing human activity
     * @return true (success) | false (failure in request)
     */
    boolean HAR_Begin_Service();
    /**
     * Stop recognizing human activity
     * @return true (success) | false (failure in request)
     */
    boolean HAR_Stop_Service();
}
