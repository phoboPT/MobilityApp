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
 *  Data:           2021.Dec.15
 *  Email
 *  Institucional:  xavier.fonseca@portic.ipp.pt
 */
package pt.portic.tech.modules.HealthReportsDB_Module;

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

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import io.realm.Sort;
import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.Public_API_HealthReportsDB_Module;
import pt.portic.tech.modules.RecommendationsModule.RecommendationsManager;
import pt.portic.tech.modules.UserProfile.UserProfileManager;

public class HealthReportsDBManager extends ReactContextBaseJavaModule implements Public_API_HealthReportsDB_Module {
private static final String TAG = "HealthReportsDBModule";
    /*
     *   Singleton Pattern
     */

    //Early, instance will be created at load time
    private static HealthReportsDBManager realmDataBaseManagerSingleton =new HealthReportsDBManager();
    private static Context context;
    private static boolean databaseInitiated = false;
    public HealthReportsDBManager() {
        databaseInitiated = false;
    }
    public static HealthReportsDBManager getInstance(){
        if (realmDataBaseManagerSingleton == null){
            synchronized(HealthReportsDBManager.class){
                if (realmDataBaseManagerSingleton == null){
                    realmDataBaseManagerSingleton = new HealthReportsDBManager();//instance will be created at request time
                }
            }
        }

        return realmDataBaseManagerSingleton;
    }

    @Override
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

        Log.d(TAG, "Health Reports DB created.");
    }

    @ReactMethod
    @Override
    public void AddDataToDB(String userID, int amountTimeStillHours,int amountTimeStillMinute,
                            int amountTimeStillSeconds,int amountTimeInVehicleHours,
                            int amountTimeInVehicleMinute,int amountTimeInVehicleSeconds,
                            int amountTimeWalkingHours,int amountTimeWalkingMinute,
                            int amountTimeWalkingSeconds, int amountTimeRunningHours,
                            int amountTimeRunningMinute, int amountTimeRunningSeconds,
                            int amountTimeOnBicycleHours,int amountTimeOnBicycleMinute,
                            int amountTimeOnBicycleSeconds, int totalAmountSedentaryHours,
                            int totalAmountSedentaryMinutes,int totalAmountActiveActivityInMinutes,
                            double metsTotais,double metsIntBaixa,double metsIntModerada,
                            double metsIntVigorosa, int metsIntBaixaPercentage,
                            int metsIntModeradaPercentage,int metsIntVigorosaPercentage,
                            int metsIntBaixaBicyclePercentage,int metsIntBaixaWalkingPercentage,
                            int metsIntBaixaRunningPercentage, int metsIntModeradaBicyclePercentage,
                            int metsIntModeradaWalkingPercentage,int metsIntModeradaRunningPercentage,
                            int metsIntVigorosaBicyclePercentage,int metsIntVigorosaWalkingPercentage,
                            int metsIntVigorosaRunningPercentage, long amountTimeStillMilliseconds,
                            long amountTimeInVehicleMilliseconds, long amountTimeWalkingMilliseconds,
                            long amountTimeRunningMilliseconds, long amountTimeOnBicycleMilliseconds,
                            long totalAmountSedentaryMilliseconds, long totalAmountActiveActivityMilliseconds,
                            double distanceWalking, double distanceRunning, double distanceBicycle) {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        // on below line we are creating
        // a variable for our modal class.
        HealthReportDataModal modal = new HealthReportDataModal();
        Realm realm = Realm.getDefaultInstance();
        Date currentDate = Calendar.getInstance().getTime();
        SimpleDateFormat df = new SimpleDateFormat("dd-MMM-yyyy", Locale.getDefault());
        String formattedDate = df.format(currentDate);
        // on below line we are getting id for the course which we are storing.
        Number id = realm.where (HealthReportDataModal.class).max("id");

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
        HealthReportDataModal existentDailyReport = realm.where(HealthReportDataModal.class).equalTo("dateOfReport", formattedDate).findFirst();

        if (existentDailyReport == null)
        {
            // on below line we are setting the
            // data entered by user in our modal class.
            modal.setId(nextId);
            modal.setUserId(userID);
            modal.setAmountTimeStillHours(amountTimeStillHours);
            modal.setAmountTimeStillMinute(amountTimeStillMinute);
            modal.setAmountTimeStillSeconds(amountTimeStillSeconds);
            modal.setAmountTimeInVehicleHours(amountTimeInVehicleHours);
            modal.setAmountTimeInVehicleMinute(amountTimeInVehicleMinute);
            modal.setAmountTimeInVehicleSeconds(amountTimeInVehicleSeconds);
            modal.setAmountTimeWalkingHours(amountTimeWalkingHours);
            modal.setAmountTimeWalkingMinute(amountTimeWalkingMinute);
            modal.setAmountTimeWalkingSeconds(amountTimeWalkingSeconds);
            modal.setAmountTimeRunningHours(amountTimeRunningHours);
            modal.setAmountTimeRunningMinute(amountTimeRunningMinute);
            modal.setAmountTimeRunningSeconds(amountTimeRunningSeconds);
            modal.setAmountTimeOnBicycleHours(amountTimeOnBicycleHours);
            modal.setAmountTimeOnBicycleMinute(amountTimeOnBicycleMinute);
            modal.setAmountTimeOnBicycleSeconds(amountTimeOnBicycleSeconds);
            modal.setTotalAmountSedentaryHours(totalAmountSedentaryHours);
            modal.setTotalAmountSedentaryMinutes(totalAmountSedentaryMinutes);
            modal.setTotalAmountActiveActivityInMinutes(totalAmountActiveActivityInMinutes);
            modal.setMetsTotais(metsTotais);
            modal.setMetsIntBaixa(metsIntBaixa);
            modal.setMetsIntModerada(metsIntModerada);
            modal.setMetsIntVigorosa(metsIntVigorosa);
            modal.setMetsIntBaixaPercentage(metsIntBaixaPercentage);
            modal.setMetsIntModeradaPercentage(metsIntModeradaPercentage);
            modal.setMetsIntVigorosaPercentage(metsIntVigorosaPercentage);
            modal.setMetsIntBaixaBicyclePercentage(metsIntBaixaBicyclePercentage);
            modal.setMetsIntBaixaWalkingPercentage(metsIntBaixaWalkingPercentage);
            modal.setMetsIntBaixaRunningPercentage(metsIntBaixaRunningPercentage);
            modal.setMetsIntModeradaBicyclePercentage(metsIntModeradaBicyclePercentage);
            modal.setMetsIntModeradaWalkingPercentage(metsIntModeradaWalkingPercentage);
            modal.setMetsIntModeradaRunningPercentage(metsIntModeradaRunningPercentage);
            modal.setMetsIntVigorosaBicyclePercentage(metsIntVigorosaBicyclePercentage);
            modal.setMetsIntVigorosaWalkingPercentage(metsIntVigorosaWalkingPercentage);
            modal.setMetsIntVigorosaRunningPercentage(metsIntVigorosaRunningPercentage);
            modal.setAmountTimeStillMilliseconds(amountTimeStillMilliseconds);
            modal.setAmountTimeInVehicleMilliseconds(amountTimeInVehicleMilliseconds);
            modal.setAmountTimeWalkingMilliseconds(amountTimeWalkingMilliseconds);
            modal.setAmountTimeRunningMilliseconds(amountTimeRunningMilliseconds);
            modal.setAmountTimeOnBicycleMilliseconds(amountTimeOnBicycleMilliseconds);
            modal.setTotalAmountSedentaryMilliseconds(totalAmountSedentaryMilliseconds);
            modal.setTotalAmountActiveActivityMilliseconds(totalAmountActiveActivityMilliseconds);
            modal.setDistanceBicycle(distanceBicycle);
            modal.setDistanceRunning(distanceRunning);
            modal.setDistanceWalking(distanceWalking);
            modal.setDateOfReport(formattedDate);
            //System.out.println("Current time => " + currentDate);


            // means this report is unique
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    // inside on execute method we are calling a method
                    // to copy to real m database from our modal class.
                    realm.copyToRealm(modal);
                }
            });
        }
        else {
            // means there is already a previous report for this date. Update

            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    existentDailyReport.setAmountTimeStillHours(amountTimeStillHours);
                    existentDailyReport.setAmountTimeStillMinute(amountTimeStillMinute);
                    existentDailyReport.setAmountTimeStillSeconds(amountTimeStillSeconds);
                    existentDailyReport.setAmountTimeInVehicleHours(amountTimeInVehicleHours);
                    existentDailyReport.setAmountTimeInVehicleMinute(amountTimeInVehicleMinute);
                    existentDailyReport.setAmountTimeInVehicleSeconds(amountTimeInVehicleSeconds);
                    existentDailyReport.setAmountTimeWalkingHours(amountTimeWalkingHours);
                    existentDailyReport.setAmountTimeWalkingMinute(amountTimeWalkingMinute);
                    existentDailyReport.setAmountTimeWalkingSeconds(amountTimeWalkingSeconds);
                    existentDailyReport.setAmountTimeRunningHours(amountTimeRunningHours);
                    existentDailyReport.setAmountTimeRunningMinute(amountTimeRunningMinute);
                    existentDailyReport.setAmountTimeRunningSeconds(amountTimeRunningSeconds);
                    existentDailyReport.setAmountTimeOnBicycleHours(amountTimeOnBicycleHours);
                    existentDailyReport.setAmountTimeOnBicycleMinute(amountTimeOnBicycleMinute);
                    existentDailyReport.setAmountTimeOnBicycleSeconds(amountTimeOnBicycleSeconds);
                    existentDailyReport.setTotalAmountSedentaryHours(totalAmountSedentaryHours);
                    existentDailyReport.setTotalAmountSedentaryMinutes(totalAmountSedentaryMinutes);
                    existentDailyReport.setTotalAmountActiveActivityInMinutes(totalAmountActiveActivityInMinutes);
                    existentDailyReport.setMetsTotais(metsTotais);
                    existentDailyReport.setMetsIntBaixa(metsIntBaixa);
                    existentDailyReport.setMetsIntModerada(metsIntModerada);
                    existentDailyReport.setMetsIntVigorosa(metsIntVigorosa);
                    existentDailyReport.setMetsIntBaixaPercentage(metsIntBaixaPercentage);
                    existentDailyReport.setMetsIntModeradaPercentage(metsIntModeradaPercentage);
                    existentDailyReport.setMetsIntVigorosaPercentage(metsIntVigorosaPercentage);
                    existentDailyReport.setMetsIntBaixaBicyclePercentage(metsIntBaixaBicyclePercentage);
                    existentDailyReport.setMetsIntBaixaWalkingPercentage(metsIntBaixaWalkingPercentage);
                    existentDailyReport.setMetsIntBaixaRunningPercentage(metsIntBaixaRunningPercentage);
                    existentDailyReport.setMetsIntModeradaBicyclePercentage(metsIntModeradaBicyclePercentage);
                    existentDailyReport.setMetsIntModeradaWalkingPercentage(metsIntModeradaWalkingPercentage);
                    existentDailyReport.setMetsIntModeradaRunningPercentage(metsIntModeradaRunningPercentage);
                    existentDailyReport.setMetsIntVigorosaBicyclePercentage(metsIntVigorosaBicyclePercentage);
                    existentDailyReport.setMetsIntVigorosaWalkingPercentage(metsIntVigorosaWalkingPercentage);
                    existentDailyReport.setMetsIntVigorosaRunningPercentage(metsIntVigorosaRunningPercentage);
                    existentDailyReport.setAmountTimeStillMilliseconds(amountTimeStillMilliseconds);
                    existentDailyReport.setAmountTimeInVehicleMilliseconds(amountTimeInVehicleMilliseconds);
                    existentDailyReport.setAmountTimeWalkingMilliseconds(amountTimeWalkingMilliseconds);
                    existentDailyReport.setAmountTimeRunningMilliseconds(amountTimeRunningMilliseconds);
                    existentDailyReport.setAmountTimeOnBicycleMilliseconds(amountTimeOnBicycleMilliseconds);
                    existentDailyReport.setTotalAmountSedentaryMilliseconds(totalAmountSedentaryMilliseconds);
                    existentDailyReport.setTotalAmountActiveActivityMilliseconds(totalAmountActiveActivityMilliseconds);
                    existentDailyReport.setDistanceBicycle(distanceBicycle);
                    existentDailyReport.setDistanceRunning(distanceRunning);
                    existentDailyReport.setDistanceWalking(distanceWalking);
                    existentDailyReport.setDateOfReport(formattedDate);

                    realm.copyToRealmOrUpdate(existentDailyReport);
                }
            });
        }

        // on below line we are calling a method to execute a transaction.
        realm.close();

        // verify if there are 7 reports already, so that we can produce our recommendations
        // read database first
        //Date currentDate = Calendar.getInstance().getTime();
        //SimpleDateFormat df = new SimpleDateFormat("dd-MMM-yyyy", Locale.getDefault());
        //String formattedDate = df.format(currentDate);
        Date dateOfLastReport;
        try {
            if (UserProfileManager.getInstance().Get_Date_Of_Last_Weekly_Report().equals(""))
            {
                // neste caso, eu só quero que a data da alegada primeira produção de relatório
                // seja esta (a de produção do primeiro relatório de saúde
                UserProfileManager.getInstance().Set_Date_Of_Last_Weekly_Report(formattedDate);
                // then no report exists yet. Produce one.
                //RecommendationsManager.getInstance().ProduceWeeklyRecommendations();
            }
            // e depois produzes o relatório só quando passou a quantidade de dias para a sua
            // produção. É improvável que o código seguinte execute alguma vez, só quando se
            // queira um relatório semanal de 1 dia.

            Date timeNow = Calendar.getInstance().getTime();
            String timeNowFormattedDate = df.format(timeNow);


            String time = UserProfileManager.getInstance().Get_Date_Of_Last_Weekly_Report();
            dateOfLastReport = new SimpleDateFormat("dd-MMM-yyyy").parse(time);

            long diffInMillies = Math.abs(timeNow.getTime() - dateOfLastReport.getTime());
            long numberOfDaysSinceLastReport = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);

            Log.d(TAG,"Numero de dias desde o último relatório semanal: " + numberOfDaysSinceLastReport);
            if (numberOfDaysSinceLastReport >= HARModuleManager.NUMBER_OF_DAYS_OF_WEEKLY_REPORT) // change this to 7
            {
                // produce weekly report and recommendations
                Log.d(TAG,"Produzindo o relatório semanal com as recomendações de saúde.");
                RecommendationsManager.getInstance().ProduceWeeklyRecommendations();
            }

        } catch (ParseException e) {
            Log.d(TAG,"Exception: " + e.toString());

            e.printStackTrace();
        }
    }

    //@ReactMethod
    @Override
    public List<HealthReportDataModal> ReadAllDataFromDB() {
        Log.d(TAG, "Called ReadAllDataFromDB");
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<HealthReportDataModal> modals = new ArrayList<HealthReportDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(HealthReportDataModal.class).findAll();

        realm.close();

        return modals;
    }

    @ReactMethod
    @Override
    public HealthReportDataModal ReadLastRecordFromDB() {
        Log.d(TAG, "Called ReadLastRecordFromDB");
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        HealthReportDataModal m = realm.where(HealthReportDataModal.class)
                .sort("id", Sort.DESCENDING)
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
    @Override
    public void ReadAllDataFromDBIntoReactNative(Callback successCallback) throws JSONException {

        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<HealthReportDataModal> modals = ReadAllDataFromDB();
        WritableArray array = new WritableNativeArray();
        JsonObject jsonObject = null;
        Log.d(TAG, "Called Got DB list into List of items");

        for (HealthReportDataModal m : modals) {

            jsonObject = new JsonObject();
            jsonObject.addProperty("id", m.getId());
            jsonObject.addProperty("userID", m.getUserId());
            jsonObject.addProperty("amountTimeStillHours", m.getAmountTimeStillHours());
            jsonObject.addProperty("amountTimeStillMinute", m.getAmountTimeStillMinute());
            jsonObject.addProperty("amountTimeStillSeconds", m.getAmountTimeStillSeconds());
            jsonObject.addProperty("amountTimeInVehicleHours", m.getAmountTimeInVehicleHours());
            jsonObject.addProperty("amountTimeInVehicleMinute", m.getAmountTimeInVehicleMinute());
            jsonObject.addProperty("amountTimeInVehicleSeconds", m.getAmountTimeInVehicleSeconds());
            jsonObject.addProperty("amountTimeWalkingHours", m.getAmountTimeWalkingHours());
            jsonObject.addProperty("amountTimeWalkingMinute", m.getAmountTimeWalkingMinute());
            jsonObject.addProperty("amountTimeWalkingSeconds", m.getAmountTimeWalkingSeconds());
            jsonObject.addProperty("amountTimeRunningHours", m.getAmountTimeRunningHours());
            jsonObject.addProperty("amountTimeRunningMinute", m.getAmountTimeRunningMinute());
            jsonObject.addProperty("amountTimeRunningSeconds", m.getAmountTimeRunningSeconds());
            jsonObject.addProperty("amountTimeOnBicycleHours", m.getAmountTimeOnBicycleHours());
            jsonObject.addProperty("amountTimeOnBicycleMinute", m.getAmountTimeOnBicycleMinute());
            jsonObject.addProperty("amountTimeOnBicycleSeconds", m.getAmountTimeOnBicycleSeconds());
            jsonObject.addProperty("totalAmountSedentaryHours", m.getTotalAmountSedentaryHours());
            jsonObject.addProperty("totalAmountSedentaryMinutes", m.getTotalAmountSedentaryMinutes());
            jsonObject.addProperty("totalAmountActiveActivityInMinutes", m.getTotalAmountActiveActivityInMinutes());
            jsonObject.addProperty("metsTotais", m.getMetsTotais());
            jsonObject.addProperty("metsIntBaixa", m.getMetsIntBaixa());
            jsonObject.addProperty("metsIntModerada", m.getMetsIntModerada());
            jsonObject.addProperty("metsIntVigorosa", m.getMetsIntVigorosa());
            jsonObject.addProperty("metsIntBaixaPercentage", m.getMetsIntBaixaPercentage());
            jsonObject.addProperty("metsIntModeradaPercentage", m.getMetsIntModeradaPercentage());
            jsonObject.addProperty("metsIntVigorosaPercentage", m.getMetsIntVigorosaPercentage());
            jsonObject.addProperty("metsIntBaixaBicyclePercentage", m.getMetsIntBaixaBicyclePercentage());
            jsonObject.addProperty("metsIntBaixaWalkingPercentage", m.getMetsIntBaixaWalkingPercentage());
            jsonObject.addProperty("metsIntBaixaRunningPercentage", m.getMetsIntBaixaRunningPercentage());
            jsonObject.addProperty("metsIntModeradaBicyclePercentage", m.getMetsIntModeradaBicyclePercentage());
            jsonObject.addProperty("metsIntModeradaWalkingPercentage", m.getMetsIntModeradaWalkingPercentage());
            jsonObject.addProperty("metsIntModeradaRunningPercentage", m.getMetsIntModeradaRunningPercentage());
            jsonObject.addProperty("metsIntVigorosaBicyclePercentage", m.getMetsIntVigorosaBicyclePercentage());
            jsonObject.addProperty("metsIntVigorosaWalkingPercentage", m.getMetsIntVigorosaWalkingPercentage());
            jsonObject.addProperty("metsIntVigorosaRunningPercentage", m.getMetsIntVigorosaRunningPercentage());
            jsonObject.addProperty("amountTimeStillMilliseconds", m.getAmountTimeStillMilliseconds());
            jsonObject.addProperty("amountTimeInVehicleMilliseconds", m.getAmountTimeInVehicleMilliseconds());
            jsonObject.addProperty("amountTimeWalkingMilliseconds", m.getAmountTimeWalkingMilliseconds());
            jsonObject.addProperty("amountTimeRunningMilliseconds", m.getAmountTimeRunningMilliseconds());
            jsonObject.addProperty("amountTimeOnBicycleMilliseconds", m.getAmountTimeOnBicycleMilliseconds());
            jsonObject.addProperty("totalAmountSedentaryMilliseconds", m.getTotalAmountSedentaryMilliseconds());
            jsonObject.addProperty("totalAmountActiveActivityMilliseconds", m.getTotalAmountActiveActivityMilliseconds());
            jsonObject.addProperty("distanceWalking", m.getDistanceWalking());
            jsonObject.addProperty("distanceRunning", m.getDistanceRunning());
            jsonObject.addProperty("distanceBicycle", m.getDistanceBicycle());
            jsonObject.addProperty("dateOfReport", m.getDateOfReport());

            JSONObject j = new JSONObject(String.valueOf(jsonObject));

            WritableMap wm = convertJsonToMap(j);
            array.pushMap(wm);
        }

        realm.close();

        successCallback.invoke(array);
    }

    @ReactMethod
    @Override
    public void UpdateDataInDB(int position, String userID, int amountTimeStillHours,int amountTimeStillMinute,
                               int amountTimeStillSeconds,int amountTimeInVehicleHours,
                               int amountTimeInVehicleMinute,int amountTimeInVehicleSeconds,
                               int amountTimeWalkingHours,int amountTimeWalkingMinute,
                               int amountTimeWalkingSeconds, int amountTimeRunningHours,
                               int amountTimeRunningMinute, int amountTimeRunningSeconds,
                               int amountTimeOnBicycleHours,int amountTimeOnBicycleMinute,
                               int amountTimeOnBicycleSeconds, int totalAmountSedentaryHours,
                               int totalAmountSedentaryMinutes,int totalAmountActiveActivityInMinutes,
                               double metsTotais,double metsIntBaixa,double metsIntModerada,
                               double metsIntVigorosa, int metsIntBaixaPercentage,
                               int metsIntModeradaPercentage,int metsIntVigorosaPercentage,
                               int metsIntBaixaBicyclePercentage,int metsIntBaixaWalkingPercentage,
                               int metsIntBaixaRunningPercentage, int metsIntModeradaBicyclePercentage,
                               int metsIntModeradaWalkingPercentage,int metsIntModeradaRunningPercentage,
                               int metsIntVigorosaBicyclePercentage,int metsIntVigorosaWalkingPercentage,
                               int metsIntVigorosaRunningPercentage,long amountTimeStillMilliseconds,
                               long amountTimeInVehicleMilliseconds, long amountTimeWalkingMilliseconds,
                               long amountTimeRunningMilliseconds, long amountTimeOnBicycleMilliseconds,
                               long totalAmountSedentaryMilliseconds, long totalAmountActiveActivityMilliseconds,
                               double distanceWalking, double distanceRunning, double distanceBicycle,
                               Date date) {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }
        Realm realm = Realm.getDefaultInstance();
        //Log.d("RealmDatabaseManModule", "Possible index: " + realm.where(ActivitiesDataModal.class).findAll().size());
        //Log.d("RealmDatabaseManModule", "Asked index: " + position);

        if (position <= realm.where(HealthReportDataModal.class).findAll().size()) {
            HealthReportDataModal modal = realm.where(HealthReportDataModal.class).equalTo("id", position).findFirst();

            SimpleDateFormat df = new SimpleDateFormat("dd-MMM-yyyy", Locale.getDefault());
            String formattedDate = df.format(date);
            // inside on execute method we are calling a method to copy
            // and update to real m database from our modal class.
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    modal.setUserId(userID);
                    modal.setAmountTimeStillHours(amountTimeStillHours);
                    modal.setAmountTimeStillMinute(amountTimeStillMinute);
                    modal.setAmountTimeStillSeconds(amountTimeStillSeconds);
                    modal.setAmountTimeInVehicleHours(amountTimeInVehicleHours);
                    modal.setAmountTimeInVehicleMinute(amountTimeInVehicleMinute);
                    modal.setAmountTimeInVehicleSeconds(amountTimeInVehicleSeconds);
                    modal.setAmountTimeWalkingHours(amountTimeWalkingHours);
                    modal.setAmountTimeWalkingMinute(amountTimeWalkingMinute);
                    modal.setAmountTimeWalkingSeconds(amountTimeWalkingSeconds);
                    modal.setAmountTimeRunningHours(amountTimeRunningHours);
                    modal.setAmountTimeRunningMinute(amountTimeRunningMinute);
                    modal.setAmountTimeRunningSeconds(amountTimeRunningSeconds);
                    modal.setAmountTimeOnBicycleHours(amountTimeOnBicycleHours);
                    modal.setAmountTimeOnBicycleMinute(amountTimeOnBicycleMinute);
                    modal.setAmountTimeOnBicycleSeconds(amountTimeOnBicycleSeconds);
                    modal.setTotalAmountSedentaryHours(totalAmountSedentaryHours);
                    modal.setTotalAmountSedentaryMinutes(totalAmountSedentaryMinutes);
                    modal.setTotalAmountActiveActivityInMinutes(totalAmountActiveActivityInMinutes);
                    modal.setMetsTotais(metsTotais);
                    modal.setMetsIntBaixa(metsIntBaixa);
                    modal.setMetsIntModerada(metsIntModerada);
                    modal.setMetsIntVigorosa(metsIntVigorosa);
                    modal.setMetsIntBaixaPercentage(metsIntBaixaPercentage);
                    modal.setMetsIntModeradaPercentage(metsIntModeradaPercentage);
                    modal.setMetsIntVigorosaPercentage(metsIntVigorosaPercentage);
                    modal.setMetsIntBaixaBicyclePercentage(metsIntBaixaBicyclePercentage);
                    modal.setMetsIntBaixaWalkingPercentage(metsIntBaixaWalkingPercentage);
                    modal.setMetsIntBaixaRunningPercentage(metsIntBaixaRunningPercentage);
                    modal.setMetsIntModeradaBicyclePercentage(metsIntModeradaBicyclePercentage);
                    modal.setMetsIntModeradaWalkingPercentage(metsIntModeradaWalkingPercentage);
                    modal.setMetsIntModeradaRunningPercentage(metsIntModeradaRunningPercentage);
                    modal.setMetsIntVigorosaBicyclePercentage(metsIntVigorosaBicyclePercentage);
                    modal.setMetsIntVigorosaWalkingPercentage(metsIntVigorosaWalkingPercentage);
                    modal.setMetsIntVigorosaRunningPercentage(metsIntVigorosaRunningPercentage);
                    modal.setAmountTimeStillMilliseconds(amountTimeStillMilliseconds);
                    modal.setAmountTimeInVehicleMilliseconds(amountTimeInVehicleMilliseconds);
                    modal.setAmountTimeWalkingMilliseconds(amountTimeWalkingMilliseconds);
                    modal.setAmountTimeRunningMilliseconds(amountTimeRunningMilliseconds);
                    modal.setAmountTimeOnBicycleMilliseconds(amountTimeOnBicycleMilliseconds);
                    modal.setTotalAmountSedentaryMilliseconds(totalAmountSedentaryMilliseconds);
                    modal.setTotalAmountActiveActivityMilliseconds(totalAmountActiveActivityMilliseconds);
                    modal.setDistanceWalking(distanceWalking);
                    modal.setDistanceRunning(distanceRunning);
                    modal.setDistanceBicycle(distanceBicycle);
                    modal.setDateOfReport(formattedDate);

                    realm.copyToRealmOrUpdate(modal);
                }
            });

        }
        else {
            Log.d(TAG, "Update position" + position + " outside possible index.");
        }

        realm.close();
    }

    @ReactMethod
    @Override
    public void DeleteRecordFromDB(int position) {
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
                Log.d(TAG, "Record requested does not exist in the DB.");
            }

        }
        else {
            Log.d(TAG, "Delete position requested" + position + " outside possible index.");
        }

        realm.close();
    }

    @ReactMethod
    @Override
    public void DeleteAllRecordsFromDB() {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        if (!databaseInitiated)  { CreateDB(HARModuleManager.mainActivityObj); }

        Realm realm = Realm.getDefaultInstance();
        List<HealthReportDataModal> modals = new ArrayList<HealthReportDataModal>();

        // on below line we are getting data from realm database in our list.
        modals = realm.where(HealthReportDataModal.class).findAll();
        for (HealthReportDataModal m : modals) {
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    m.deleteFromRealm();
                }
            });
        }

        realm.close();
    }

    @NonNull
    @Override
    public String getName() {
        return "HealthReportsDBManager";
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
