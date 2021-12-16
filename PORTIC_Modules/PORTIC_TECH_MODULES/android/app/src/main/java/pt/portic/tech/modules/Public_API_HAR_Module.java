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
 *  Data:           2021.Nov.10
 *  Email
 *  Institucional:  xavier.fonseca@portic.ipp.pt
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

    /**
     * Use this method to set up the night period [time A, time B]. This is to ignore
     * sedentary activities of type STILL when the user is likely to sleep. This does
     * not affect the recognition and logging of any other relevant activity (including
     * in vehicle, which is also sedentary).
     * Example, if set period is [22h, 09h], then all the STILL activities between 22h
     * and 09h will be ignored (not registered).
     *
     * @param timeA the beginning of the night period
     * @param timeB the end of the night period
     */
    void SetNightTimePeriodToIgnoreActivity(int timeA, int timeB);
}
