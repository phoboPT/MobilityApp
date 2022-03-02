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

import java.util.Map;

public interface Public_API_UserProfile_Module {
    /********************************************************************************
     ***************************** Módulo User Profile ******************************
     ************ para armazenamento do perfil + preferências do utilizador *********
     * Preferências guardadas:
     * User ID
     * Name
     * Birth date(YYYY.MM.DD)
     * Gender (M/F)
     * Height
     * Weight
     * Health Activity Risk
     * Date of Last weekly Report
     *
     * Com os respetivos setters e getters
     *
     * Não estão ainda guardados aqui, mas este será o sítio para guardar eventuais
     * definições da aplicação (notificações).
     *******************************************************************************/

    /* Stored as STRING */
    void Set_User_ID(String id);


    /* Stored as STRING */
    void Set_User_Name(String name);

    /* Stored as LONG, format YYYYMMDD */
    void Set_User_BirthDate(String date);

    /* Stored as STRING, format M/F */
    void Set_User_Gender(String gender);

    /* Stored as FLOAT, format 1.75 */
    void Set_User_Height(String height);

    /* Stored as FLOAT, format 65.1 */
    void Set_User_Weight(String weight);

    /* Stored as INTEGER, format 1 */
    void Set_Health_Activity_Risk(String risk);

    /* Stored as STRING, format dd-mm-yyyy*/
    void Set_Date_Of_Last_Weekly_Report(String date);

    /* Stored as STRING */
    Map<String, ?> Get_User_ALL_Data();

    /* Stored as STRING */
    String Get_User_ID();

    /* Stored as STRING */
    String Get_User_Name();

    /* Stored as LONG, format YYYYMMDD */
    Long Get_User_BirthDate();

    /* Stored as STRING, format M/F */
    String Get_User_Gender();

    /* Stored as FLOAT, format 1.75 */
    Float Get_User_Height();

    /* Stored as FLOAT, format 65.1 */
    Float Get_User_Weight();

    /* Stored as INTEGER, format 1 */
    Integer Get_Health_Activity_Risk();

    /* Stored as STRING, format dd-mm-yyyy*/
    String Get_Date_Of_Last_Weekly_Report();

    /**
     * Example of how data is stored:
     *
     * <string name="user_Gender">M</string>
     * <long name="user_BirthDate" value="19871009" />
     * <float name="user_Weight" value="76.1" />
     * <string name="user_Name">xavier</string>
     * <string name="user_ID">01</string>
     * <float name="user_Height" value="1.8" />
     *
     */
}
