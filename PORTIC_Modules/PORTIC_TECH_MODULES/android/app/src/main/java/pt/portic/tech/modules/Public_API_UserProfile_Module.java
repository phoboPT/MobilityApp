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
