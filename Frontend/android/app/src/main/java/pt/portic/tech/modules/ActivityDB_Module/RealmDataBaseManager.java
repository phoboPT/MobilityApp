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
package pt.portic.tech.modules.ActivityDB_Module;


import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.JsonObject;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import io.realm.Sort;
import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.HealthReportsDB_Module.HealthReportDataModal;
import pt.portic.tech.modules.Public_API_ActivityDB_Module;
import pt.portic.tech.modules.RecommendationsModule.WeeklyReportDataModal;

/**
 * Follow:
 * https://www.geeksforgeeks.org/how-to-install-and-add-data-to-realm-database-in-android/
 */

/**
 * This module is called by the HAR Module. It's that module passing the
 * Context of the application to be used by this module.
 */
public class RealmDataBaseManager extends ReactContextBaseJavaModule implements Public_API_ActivityDB_Module {

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
        //Realm.init(context);
        if (context == null)
        {
            Realm.init(Realm.getApplicationContext());
        }
        else {
            Realm.init(context);
        }

        // on below line we are setting realm configuration
        RealmConfiguration config =
                new RealmConfiguration.Builder()
                        //.name("DetectedActivities.db")
                        .name(HARModuleManager.PORTIC_Database_Name)
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

    @ReactMethod
    @Override
    public void AddDataToDB(String userID, String timeStamp, int activityType, String activityDescription, int confidence, double lat, double lon) {
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
        modal.setLatitude(lat);
        modal.setLongitude(lon);

        // on below line we are calling a method to execute a transaction.
        realm.executeTransaction(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                // inside on execute method we are calling a method
                // to copy to real m database from our modal class.
                realm.copyToRealm(modal);
            }
        });

        realm.close();
    }

    //@ReactMethod
    @Override
    public List<ActivitiesDataModal> ReadAllDataFromDB() {
        Log.d("RealmDatabaseManModule", "Called ReadAllDataFromDB");
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<ActivitiesDataModal> modals = new ArrayList<ActivitiesDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(ActivitiesDataModal.class).findAll();
        /*
        for (ActivitiesDataModal m : modals) {
            Log.d("RealmDatabaseManModule", "Read from DB -> " + m.getId() + " : " + m.getUserId() +
                    " : " + m.getActivityType() + " : " + m.getActivityDescription() + " : " +
                    m.getTimestamp() + " : " + m.getConfidence());
        }*/

        realm.close();

        return modals;
    }

    @ReactMethod
    @Override
    public ActivitiesDataModal ReadLastRecordFromDB() {
        Log.d("RealmDatabaseManModule", "Called ReadLastRecordFromDB");
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        ActivitiesDataModal m = realm.where(ActivitiesDataModal.class)
                .sort("timestamp", Sort.DESCENDING)
                .findFirst();

        realm.close();
        if(m != null){
            return m;
        }
        else {
            return null;
        }

    }


    @ReactMethod
    public void ReadAllDataFromDBIntoReactNative(Callback successCallback) throws Exception {
        Realm realm;

        try {
            realm = Realm.getDefaultInstance();
        }
        catch (java.lang.IllegalStateException e){
            Log.d("RealmDataBaseManager","Tried getting Realm default Instance at ReadAllDataFromDBIntoReactNative. Error: " + e.toString());

            if (Realm.getApplicationContext() == null)
            {
                //if (context != null)
                //{
                //    Realm.init(context);
                //}
                //else
                if (HARModuleManager.mainActivityObj != null) {
                    Realm.init(HARModuleManager.mainActivityObj);
                }
                else {
                    throw new Exception("ReadAllDataFromDBIntoReactNative: Problem with Contexts being null.");
                }
            }
            else {
                Realm.init(Realm.getApplicationContext());
            }


            // on below line we are setting realm configuration
            RealmConfiguration config =
                    new RealmConfiguration.Builder()
                            //.name("DetectedActivities.db")
                            .name(HARModuleManager.PORTIC_Database_Name)
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

            realm = Realm.getDefaultInstance();
        }














        List<ActivitiesDataModal> modals = ReadAllDataFromDB();
        WritableArray array = new WritableNativeArray();
        JsonObject jsonObject = null;
        Log.d("RealmDatabaseManModule", "Called Got DB list into List of items");

        for (ActivitiesDataModal m : modals) {

            jsonObject = new JsonObject();
            jsonObject.addProperty("id", m.getId());
            jsonObject.addProperty("userID", m.getUserId());
            jsonObject.addProperty("timestamp", m.getTimestamp());
            jsonObject.addProperty("activityType", m.getActivityType());
            jsonObject.addProperty("activityDescription", m.getActivityDescription());
            jsonObject.addProperty("confidence", m.getConfidence());
            jsonObject.addProperty("latitude", m.getLatitude());
            jsonObject.addProperty("longitude", m.getLongitude());

            JSONObject j = new JSONObject(String.valueOf(jsonObject));

            WritableMap wm = convertJsonToMap(j);
            array.pushMap(wm);
        }

        realm.close();

        successCallback.invoke(array);
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
    @ReactMethod
    @Override
    public void UpdateDataInDB(int position, String userID, String timeStamp, int activityType, String activityDescription, int confidence, double lat, double lon) {
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
                    modal.setLatitude(lat);
                    modal.setLongitude(lon);

                    realm.copyToRealmOrUpdate(modal);
                }
            });

        }
        else {
            Log.d("RealmDatabaseManModule", "Update position" + position + " outside possible index.");
            Log.e("RealmDatabaseManModule", "Update position" + position + " outside possible index.");
        }

        realm.close();
    }

    /**
     * Given the position index of the record to delete, this method deletes it from the DB. Example:
     * DeleteRecordFromDB(5);
     *
     * @param position
     */
    @ReactMethod
    @Override
    public void DeleteRecordFromDBActivitiesDataModal(int position) {
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

        realm.close();
    }

    @ReactMethod
    @Override
    public void DeleteRecordFromDBHealthReportDataModal(int position) {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();

        if (position <= realm.where(HealthReportDataModal.class).findAll().size()) {
            HealthReportDataModal modal = realm.where(HealthReportDataModal.class).equalTo("id", position).findFirst();

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

        realm.close();
    }
    @ReactMethod
    @Override
    public void DeleteRecordFromDBWeeklyReportDataModal(int position) {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();

        if (position <= realm.where(WeeklyReportDataModal.class).findAll().size()) {
            WeeklyReportDataModal modal = realm.where(WeeklyReportDataModal.class).equalTo("id", position).findFirst();

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

        realm.close();
    }

    /**
     * Clean all the records from the database to initiate another cycle of recording. For example,
     * Cleaning the last 24H of recordings.
     */
    @ReactMethod
    @Override
    public void DeleteAllRecordsFromDB() {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<ActivitiesDataModal> modalsActivities = new ArrayList<ActivitiesDataModal>();
        List<HealthReportDataModal> modalsHealthReports = new ArrayList<HealthReportDataModal>();
        List<WeeklyReportDataModal> modalsWeeklyReports = new ArrayList<WeeklyReportDataModal>();

        // on below line we are getting data from realm database in our list.
        modalsActivities = realm.where(ActivitiesDataModal.class).findAll();
        for (ActivitiesDataModal m : modalsActivities) {
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    m.deleteFromRealm();
                }
            });
        }

        modalsHealthReports =  realm.where(HealthReportDataModal.class).findAll();
        for (HealthReportDataModal m : modalsHealthReports) {
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    m.deleteFromRealm();
                }
            });
        }

        modalsWeeklyReports = realm.where(WeeklyReportDataModal.class).findAll();
        for (WeeklyReportDataModal m : modalsWeeklyReports) {
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    m.deleteFromRealm();
                }
            });
        }

        Log.d("RealmDataBaseManager","Every record from the overall Database " + HARModuleManager.PORTIC_Database_Name +" is DELETED.");

        realm.close();
    }

    @Override
    public void DeleteAllActivityRecordsFromDB() {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<ActivitiesDataModal> modalsActivities = new ArrayList<ActivitiesDataModal>();

        // on below line we are getting data from realm database in our list.
        modalsActivities = realm.where(ActivitiesDataModal.class).findAll();
        for (ActivitiesDataModal m : modalsActivities) {
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    m.deleteFromRealm();
                }
            });
        }

        Log.d("RealmDataBaseManager","Every record from the Activitiies' Database " + HARModuleManager.PORTIC_Database_Name +" is DELETED.");

        realm.close();
    }

    @NonNull
    @Override
    public String getName() {
        return "ActivitiesDatabaseModule";
    }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String) {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }
}