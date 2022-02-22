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
 *  Data:           2021.Dec.17
 *  Email
 *  Institucional:  xavier.fonseca@portic.ipp.pt
 */
package pt.portic.tech.modules;

import com.facebook.react.bridge.Callback;

import org.json.JSONException;

import io.realm.RealmList;
import pt.portic.tech.modules.RecommendationsModule.WeeklyReportDataModal;

public interface Public_API_Recommendations_Module {

    void ProduceWeeklyRecommendations();
    /**
     * This method produces a list of recommendations
     * @return List of strings, each of which containing a recommendation
     */
    RealmList<String> GetWeeklyRecommendations(WeeklyReportDataModal weeklyReport);

    RealmList<String> GetWeeklyRecommendations();
    /**
     * This method returns the most recent weekly report available. if it exists. otherwise returns
     * null.
     *
     * @return WeeklyReportDataModal or null
     */
    WeeklyReportDataModal GetLastWeeklyReport();

    /**
     * I need to get the report from the position X. Index goes from 0 to the number of reports in
     * the database. Example: if you pass index 0, it will get you the most recent report; with
     * index = 1, you will get the before last index; index = 2, you'll get the weekly report from
     * three weeks ago.
     *
     * @param index [0, reportsMaxSize]
     * @return WeeklyReportDataModal (report in the index position, or null
     */
    WeeklyReportDataModal GetWeeklyReport(int index);

    void ReadAllWeeklyReportsFromDBIntoReactNative(Callback successCallback) throws JSONException;
}
