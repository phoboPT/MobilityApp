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


import android.content.Context;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.Public_API_ActivityDB_Module;

/**
 * Follow:
 * https://www.geeksforgeeks.org/how-to-install-and-add-data-to-realm-database-in-android/
 */

/**
 * This module is called by the HAR Module. It's that module passing the
 * Context of the application to be used by this module.
 */
public class RealmDataBaseManager implements Public_API_ActivityDB_Module {

    /*
     *   Singleton Pattern
     */

    //Early, instance will be created at load time
    private static RealmDataBaseManager realmDataBaseManagerSingleton =new RealmDataBaseManager();
    private static Context context;
    private static boolean databaseInitiated = false;
    public RealmDataBaseManager() {
        databaseInitiated = false;
    }
    public static RealmDataBaseManager getInstance(){
        if (realmDataBaseManagerSingleton == null){
            synchronized(RealmDataBaseManager.class){
                if (realmDataBaseManagerSingleton == null){
                    realmDataBaseManagerSingleton = new RealmDataBaseManager();//instance will be created at request time
                }
            }
        }

        return realmDataBaseManagerSingleton;
    }


    public void CreateDB (Context context) {

        // getting the context of the main application, to access the application preferences
        // on below line we are
        // initializing our realm database.
        Realm.init(context);

        // on below line we are setting realm configuration
        RealmConfiguration config =
                new RealmConfiguration.Builder()
                        .name("DetectedActivities.db")
                        // below line is to allow write
                        // data to database on ui thread.
                        .allowWritesOnUiThread(true)
                        // below line is to delete realm
                        // if migration is needed.
                        .deleteRealmIfMigrationNeeded()
                        // at last we are calling a method to build.
                        .build();
        // on below line we are setting
        // configuration to our realm database.
        Realm.setDefaultConfiguration(config);

        databaseInitiated = true;

        Log.d("RealmDatabaseManModule", "Detected Activities DB created.");
    }

    @Override
    public void AddDataToDB(String userID, String timeStamp, int activityType, String activityDescription, int confidence) {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        // on below line we are creating
        // a variable for our modal class.
        ActivitiesDataModal modal = new ActivitiesDataModal();
        Realm realm = Realm.getDefaultInstance();

        // on below line we are getting id for the course which we are storing.
        Number id = realm.where (ActivitiesDataModal.class).max("id");

        // on below line we are
        // creating a variable for our id.
        long nextId;

        // validating if id is null or not.
        if (id == null) {
            // if id is null
            // we are passing it as 1.
            nextId = 1;
        } else {
            // if id is not null then
            // we are incrementing it by 1
            nextId = id.intValue() + 1;
        }

        // on below line we are setting the
        // data entered by user in our modal class.
        modal.setId(nextId);
        modal.setUserId(userID);
        modal.setTimestamp(timeStamp);
        modal.setActivityType(activityType);
        modal.setActivityDescription(activityDescription);
        modal.setConfidence(confidence);

        // on below line we are calling a method to execute a transaction.
        realm.executeTransaction(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                // inside on execute method we are calling a method
                // to copy to real m database from our modal class.
                realm.copyToRealm(modal);
            }
        });
    }

    @Override
    public List<ActivitiesDataModal> ReadAllDataFromDB() {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<ActivitiesDataModal> modals = new ArrayList<ActivitiesDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(ActivitiesDataModal.class).findAll();
        for (ActivitiesDataModal m : modals) {
            Log.d("RealmDatabaseManModule", "Read from DB -> " + m.getId() + " : " + m.getUserId() +
                    " : " + m.getActivityType() + " : " + m.getActivityDescription() + " : " +
                    m.getTimestamp() + " : " + m.getConfidence());
        }

        return modals;
    }

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
    @Override
    public void UpdateDataInDB(int position, String userID, String timeStamp, int activityType, String activityDescription, int confidence) {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }
        Realm realm = Realm.getDefaultInstance();
        //Log.d("RealmDatabaseManModule", "Possible index: " + realm.where(ActivitiesDataModal.class).findAll().size());
        //Log.d("RealmDatabaseManModule", "Asked index: " + position);

        if (position <= realm.where(ActivitiesDataModal.class).findAll().size()) {
            ActivitiesDataModal modal = realm.where(ActivitiesDataModal.class).equalTo("id", position).findFirst();

            // inside on execute method we are calling a method to copy
            // and update to real m database from our modal class.
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    modal.setUserId(userID);
                    modal.setTimestamp(timeStamp);
                    modal.setActivityType(activityType);
                    modal.setActivityDescription(activityDescription);
                    modal.setConfidence(confidence);

                    realm.copyToRealmOrUpdate(modal);
                }
            });

        }
        else {
            Log.d("RealmDatabaseManModule", "Update position" + position + " outside possible index.");
            Log.e("RealmDatabaseManModule", "Update position" + position + " outside possible index.");
        }
    }

    /**
     * Given the position index of the record to delete, this method deletes it from the DB. Example:
     * DeleteRecordFromDB(5);
     *
     * @param position
     */
    @Override
    public void DeleteRecordFromDB(int position) {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();

        if (position <= realm.where(ActivitiesDataModal.class).findAll().size()) {
            ActivitiesDataModal modal = realm.where(ActivitiesDataModal.class).equalTo("id", position).findFirst();

            if (modal != null) {
                // inside on execute method we are calling a method to delete our modal from db.
                realm.executeTransaction(new Realm.Transaction() {
                    @Override
                    public void execute(Realm realm) {
                        modal.deleteFromRealm();
                    }
                });
            }
            else {
                Log.d("RealmDatabaseManModule", "Record requested does not exist in the DB.");
                Log.e("RealmDatabaseManModule", "Record requested does not exist in the DB.");
            }

        }
        else {
            Log.d("RealmDatabaseManModule", "Delete position requested" + position + " outside possible index.");
            Log.e("RealmDatabaseManModule", "Delete position requested" + position + " outside possible index.");
        }
    }

    /**
     * Clean all the records from the database to initiate another cycle of recording. For example,
     * Cleaning the last 24H of recordings.
     */
    @Override
    public void DeleteAllRecordsFromDB() {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<ActivitiesDataModal> modals = new ArrayList<ActivitiesDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(ActivitiesDataModal.class).findAll();
        for (ActivitiesDataModal m : modals) {
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    m.deleteFromRealm();
                }
            });
        }
    }
}