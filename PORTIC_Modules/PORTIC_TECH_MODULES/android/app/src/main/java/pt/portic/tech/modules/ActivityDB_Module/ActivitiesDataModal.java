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
package pt.portic.tech.modules.ActivityDB_Module;

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class ActivitiesDataModal extends RealmObject {
    // on below line we are creating our variables
    // and with are using primary key for our id.
    @PrimaryKey
    private long id;
    private String userID;
    private String timestamp;
    private int activityType;
    private String activityDescription;
    private int confidence;



    // on below line we are
    // creating an empty constructor.
    public ActivitiesDataModal() {
    }

    // below line we are
    // creating getter and setters.
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public String getUserId() {
        return userID;
    }
    public void setUserId(String uid) { this.userID = uid;  }
    public String getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
    public int getActivityType() {
        return activityType;
    }
    public void setActivityType(int activityType) {
        this.activityType = activityType;
    }
    public String getActivityDescription() {
        return activityDescription;
    }
    public void setActivityDescription(String activityDescription) {
        this.activityDescription = activityDescription;
    }
    public int getConfidence() {
        return confidence;
    }
    public void setConfidence(int confidence) {
        this.confidence = confidence;
    }
}
