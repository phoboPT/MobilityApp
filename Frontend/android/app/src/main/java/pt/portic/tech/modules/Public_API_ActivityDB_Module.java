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

import android.content.Context;

import java.util.List;

import pt.portic.tech.modules.ActivityDB_Module.ActivitiesDataModal;

public interface Public_API_ActivityDB_Module {

    public void CreateDB (Context context);

    public void AddDataToDB(String userID, String timeStamp, int activityType, String activityDescription, int confidence, double lat, double lon);

    public List<ActivitiesDataModal> ReadAllDataFromDB();

    public ActivitiesDataModal ReadLastRecordFromDB();

    /**
     * Given the position of the record you want to change, give the new data. Example:
     * UpdateDataInDB(5, "98765", "2021-11-19 18:29:07.018",3,"STILL", 100);
     *
     * @param position
     * @param userID
     * @param timeStamp
     * @param activityType
     * @param activityDescription
     * @param confidence
     */
    public void UpdateDataInDB(int position, String userID, String timeStamp, int activityType, String activityDescription, int confidence, double lat, double lon);


    /**
     * Given the position index of the record to delete, this method deletes it from the DB. Example:
     * DeleteRecordFromDB(5);
     *
     * @param position
     */
    void DeleteRecordFromDBActivitiesDataModal(int position);
    void DeleteRecordFromDBHealthReportDataModal(int position);
    void DeleteRecordFromDBWeeklyReportDataModal(int position);

    /**
     * Clean all the records from the database to initiate another cycle of recording. For example,
     * Cleaning the last 24H of recordings.
     */
    void DeleteAllRecordsFromDB();

    /**
     * This method cleans all the activities and GPS data from the activities database.
     * Should be called for e.g., when the weekly report is produced, so that this DB frees up
     * space that is no longer needed.
     */
    void DeleteAllActivityRecordsFromDB();
}
