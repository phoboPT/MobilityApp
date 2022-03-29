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
package pt.portic.tech.modules.RecommendationsModule;

import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Locale;

import io.realm.Realm;
import io.realm.RealmConfiguration;
import io.realm.RealmList;
import io.realm.Sort;
import pt.portic.tech.modules.ActivityDB_Module.RealmDataBaseManager;
import pt.portic.tech.modules.HARModule.HARModuleManager;
import pt.portic.tech.modules.HealthReportsDB_Module.HealthReportDataModal;
import pt.portic.tech.modules.Public_API_Recommendations_Module;
import pt.portic.tech.modules.UserProfile.UserProfileManager;

public class RecommendationsManager extends ReactContextBaseJavaModule implements Public_API_Recommendations_Module {
    private final String TAG = "RecommendationsManModule";
    private static RecommendationsManager recommendationsManagerSingleton =null;
    static AppCompatActivity activity;

    public RecommendationsManager() { activity = HARModuleManager.mainActivityObj;  }
    public RecommendationsManager(AppCompatActivity activityObj) {activity = activityObj;}

    public static RecommendationsManager getInstance(){
        if (recommendationsManagerSingleton == null){
            synchronized(RecommendationsManager.class){
                if (recommendationsManagerSingleton == null){
                    //instance will be created at request time
                    recommendationsManagerSingleton = new RecommendationsManager();
                }
            }
        }

        return recommendationsManagerSingleton;
    }
    public static RecommendationsManager getInstance(AppCompatActivity activityObj){
        if (recommendationsManagerSingleton == null){
            synchronized(RecommendationsManager.class){
                if (recommendationsManagerSingleton == null){
                    //instance will be created at request time
                    recommendationsManagerSingleton = new RecommendationsManager(activityObj);
                }
            }
        }

        return recommendationsManagerSingleton;
    }

    @NonNull
    @Override
    public String getName() {
        return "RecommendationsManager";
    }
    @ReactMethod
    @Override
    public void ProduceWeeklyRecommendations() {

        Log.d(TAG, "Producing the weekly health report (last " + HARModuleManager.NUMBER_OF_DAYS_OF_WEEKLY_REPORT + " days)...");
        Realm realm;

        List<HealthReportDataModal> healthReports = null;
        //List<WeeklyReportDataModal> allWeeklyReports = null;
        Date currentDate = Calendar.getInstance().getTime();
        SimpleDateFormat df = new SimpleDateFormat("dd-MMM-yyyy", Locale.getDefault());
        String formattedDate = df.format(currentDate);

        //verify if weekly report exists here
        VerifyIfWeeklyReportExistsOnThisDate(formattedDate);

        try {
            if (activity == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(activity);
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

            realm = Realm.getDefaultInstance();
            healthReports = new ArrayList<HealthReportDataModal>();
            healthReports = realm.where(HealthReportDataModal.class).findAll()
                    .sort("id", Sort.DESCENDING);
            ListIterator<HealthReportDataModal> it = healthReports.listIterator();
            //allWeeklyReports = realm.where(WeeklyReportDataModal.class).findAll();
            Number id = realm.where (WeeklyReportDataModal.class).max("id");
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

            WeeklyReportDataModal nextWeeklyReport = new WeeklyReportDataModal();
            int index = 0;
            //HealthReportDataModal sumOfLastHealthReports = new HealthReportDataModal();
            nextWeeklyReport.setId(nextId);
            nextWeeklyReport.setUserID(UserProfileManager.getInstance().Get_User_ID());
            nextWeeklyReport.setDateOfReport(formattedDate);

            HealthReportDataModal report = null;
            long amountTimeStillMilliseconds = 0, amountTimeInVehicleMilliseconds = 0,
                    amountTimeWalkingMilliseconds = 0,amountTimeRunningMilliseconds = 0,
                    amountTimeOnBicycleMilliseconds = 0,totalAmountSedentaryMilliseconds = 0,
                    totalAmountActiveActivityMilliseconds = 0;
            int amountTimeStillHours = 0,amountTimeStillMinute = 0,amountTimeStillSeconds = 0,
                    amountTimeInVehicleHours = 0,amountTimeInVehicleMinute = 0,amountTimeInVehicleSeconds = 0;
            int amountTimeWalkingHours = 0,amountTimeWalkingMinute = 0,amountTimeWalkingSeconds = 0,
                    amountTimeRunningHours = 0,amountTimeRunningMinute = 0,amountTimeRunningSeconds = 0,
                    amountTimeOnBicycleHours = 0,amountTimeOnBicycleMinute = 0,amountTimeOnBicycleSeconds = 0;
            int totalAmountSedentaryHours = 0, totalAmountSedentaryMinutes = 0,
                    totalAmountActiveActivityInMinutes = 0;
            double metsTotais = 0, metsIntBaixa = 0, metsIntModerada = 0, metsIntVigorosa = 0;
            int metsIntBaixaPercentage = 0,metsIntModeradaPercentage = 0,metsIntVigorosaPercentage = 0;
            int metsIntBaixaBicyclePercentage = 0,metsIntBaixaWalkingPercentage = 0,
                    metsIntBaixaRunningPercentage = 0;
            int metsIntModeradaBicyclePercentage = 0,metsIntModeradaWalkingPercentage = 0,
                    metsIntModeradaRunningPercentage = 0;
            int metsIntVigorosaBicyclePercentage = 0,metsIntVigorosaWalkingPercentage = 0,
                    metsIntVigorosaRunningPercentage = 0;
            double distanceWalking = 0, distanceRunning = 0, distanceBicycle = 0;
            // now do something with the next up to 7 reports
            while((it.hasNext()) && (index <= HARModuleManager.NUMBER_OF_DAYS_OF_WEEKLY_REPORT)) {
                report = it.next();
                amountTimeStillMilliseconds += report.getAmountTimeStillMilliseconds();
                amountTimeInVehicleMilliseconds +=report.getAmountTimeInVehicleMilliseconds();
                amountTimeWalkingMilliseconds +=report.getAmountTimeWalkingMilliseconds();
                amountTimeRunningMilliseconds +=report.getAmountTimeRunningMilliseconds();
                amountTimeOnBicycleMilliseconds +=report.getAmountTimeOnBicycleMilliseconds();
                totalAmountSedentaryMilliseconds +=report.getTotalAmountSedentaryMilliseconds();
                totalAmountActiveActivityMilliseconds +=report.getTotalAmountActiveActivityMilliseconds();
                amountTimeStillHours +=report.getAmountTimeStillHours();
                amountTimeStillMinute +=report.getAmountTimeStillMinute();
                amountTimeStillSeconds +=report.getAmountTimeStillSeconds();
                amountTimeInVehicleHours +=report.getAmountTimeInVehicleHours();
                amountTimeInVehicleMinute +=report.getAmountTimeInVehicleMinute();
                amountTimeInVehicleSeconds +=report.getAmountTimeInVehicleSeconds();
                amountTimeWalkingHours +=report.getAmountTimeWalkingHours();
                amountTimeWalkingMinute +=report.getAmountTimeWalkingMinute();
                amountTimeWalkingSeconds +=report.getAmountTimeWalkingSeconds();
                amountTimeRunningHours+=report.getAmountTimeRunningHours();
                amountTimeRunningMinute+=report.getAmountTimeRunningMinute();
                amountTimeRunningSeconds +=report.getAmountTimeRunningSeconds();
                amountTimeOnBicycleHours +=report.getAmountTimeOnBicycleHours();
                amountTimeOnBicycleMinute +=report.getAmountTimeOnBicycleMinute();
                amountTimeOnBicycleSeconds +=report.getAmountTimeOnBicycleSeconds();
                totalAmountSedentaryHours +=report.getTotalAmountSedentaryHours();
                totalAmountSedentaryMinutes +=report.getTotalAmountSedentaryMinutes();
                totalAmountActiveActivityInMinutes +=report.getTotalAmountActiveActivityInMinutes();
                metsTotais +=report.getMetsTotais();
                metsIntBaixa +=report.getMetsIntBaixa();
                metsIntModerada +=report.getMetsIntModerada();
                metsIntVigorosa +=report.getMetsIntVigorosa();
                metsIntBaixaPercentage +=report.getMetsIntBaixaPercentage();
                metsIntModeradaPercentage +=report.getMetsIntModeradaPercentage();
                metsIntVigorosaPercentage +=report.getMetsIntVigorosaPercentage();
                metsIntBaixaBicyclePercentage +=report.getMetsIntBaixaBicyclePercentage();
                metsIntBaixaWalkingPercentage +=report.getMetsIntBaixaWalkingPercentage();
                metsIntBaixaRunningPercentage +=report.getMetsIntBaixaRunningPercentage();
                metsIntModeradaBicyclePercentage +=report.getMetsIntModeradaBicyclePercentage();
                metsIntModeradaWalkingPercentage +=report.getMetsIntModeradaWalkingPercentage();
                metsIntModeradaRunningPercentage +=report.getMetsIntModeradaRunningPercentage();
                metsIntVigorosaBicyclePercentage +=report.getMetsIntVigorosaBicyclePercentage();
                metsIntVigorosaWalkingPercentage +=report.getMetsIntVigorosaWalkingPercentage();
                metsIntVigorosaRunningPercentage +=report.getMetsIntVigorosaRunningPercentage();
                distanceWalking += report.getDistanceWalking();
                distanceRunning +=report.getDistanceRunning();
                distanceBicycle +=report.getDistanceBicycle();

                index ++;
            }

            nextWeeklyReport.setAmountTimeStillMilliseconds(amountTimeStillMilliseconds);
            nextWeeklyReport.setAmountTimeInVehicleMilliseconds(amountTimeInVehicleMilliseconds);
            nextWeeklyReport.setAmountTimeWalkingMilliseconds(amountTimeWalkingMilliseconds);
            nextWeeklyReport.setAmountTimeRunningMilliseconds(amountTimeRunningMilliseconds);
            nextWeeklyReport.setAmountTimeOnBicycleMilliseconds(amountTimeOnBicycleMilliseconds);
            nextWeeklyReport.setTotalAmountSedentaryMilliseconds(totalAmountSedentaryMilliseconds);
            nextWeeklyReport.setTotalAmountActiveActivityMilliseconds(totalAmountActiveActivityMilliseconds);
            nextWeeklyReport.setAmountTimeStillHours(amountTimeStillHours);
            nextWeeklyReport.setAmountTimeStillMinute(amountTimeStillMinute);
            nextWeeklyReport.setAmountTimeStillSeconds(amountTimeStillSeconds);
            nextWeeklyReport.setAmountTimeInVehicleHours(amountTimeInVehicleHours);
            nextWeeklyReport.setAmountTimeInVehicleMinute(amountTimeInVehicleMinute);
            nextWeeklyReport.setAmountTimeInVehicleSeconds(amountTimeInVehicleSeconds);
            nextWeeklyReport.setAmountTimeWalkingHours(amountTimeWalkingHours);
            nextWeeklyReport.setAmountTimeWalkingMinute(amountTimeWalkingMinute);
            nextWeeklyReport.setAmountTimeWalkingSeconds(amountTimeWalkingSeconds);
            nextWeeklyReport.setAmountTimeRunningHours(amountTimeRunningHours);
            nextWeeklyReport.setAmountTimeRunningMinute(amountTimeRunningMinute);
            nextWeeklyReport.setAmountTimeRunningSeconds(amountTimeRunningSeconds);
            nextWeeklyReport.setAmountTimeOnBicycleHours(amountTimeOnBicycleHours);
            nextWeeklyReport.setAmountTimeOnBicycleMinute(amountTimeOnBicycleMinute);
            nextWeeklyReport.setAmountTimeOnBicycleSeconds(amountTimeOnBicycleSeconds);
            nextWeeklyReport.setTotalAmountSedentaryHours(totalAmountSedentaryHours);
            nextWeeklyReport.setTotalAmountSedentaryMinutes(totalAmountSedentaryMinutes);
            nextWeeklyReport.setTotalAmountActiveActivityInMinutes(totalAmountActiveActivityInMinutes);
            nextWeeklyReport.setMetsTotais(metsTotais);
            nextWeeklyReport.setMetsIntBaixa(metsIntBaixa);
            nextWeeklyReport.setMetsIntModerada(metsIntModerada);
            nextWeeklyReport.setMetsIntVigorosa(metsIntVigorosa);
            nextWeeklyReport.setMetsIntBaixaPercentage(metsIntBaixaPercentage);
            nextWeeklyReport.setMetsIntModeradaPercentage(metsIntModeradaPercentage);
            nextWeeklyReport.setMetsIntVigorosaPercentage(metsIntVigorosaPercentage);
            nextWeeklyReport.setMetsIntBaixaBicyclePercentage(metsIntBaixaBicyclePercentage);
            nextWeeklyReport.setMetsIntBaixaWalkingPercentage(metsIntBaixaWalkingPercentage);
            nextWeeklyReport.setMetsIntBaixaRunningPercentage(metsIntBaixaRunningPercentage);
            nextWeeklyReport.setMetsIntModeradaBicyclePercentage(metsIntModeradaBicyclePercentage);
            nextWeeklyReport.setMetsIntModeradaWalkingPercentage(metsIntModeradaWalkingPercentage);
            nextWeeklyReport.setMetsIntModeradaRunningPercentage(metsIntModeradaRunningPercentage);
            nextWeeklyReport.setMetsIntVigorosaBicyclePercentage(metsIntVigorosaBicyclePercentage);
            nextWeeklyReport.setMetsIntVigorosaWalkingPercentage(metsIntVigorosaWalkingPercentage);
            nextWeeklyReport.setMetsIntVigorosaRunningPercentage(metsIntVigorosaRunningPercentage);
            nextWeeklyReport.setDistanceWalking(distanceWalking);
            nextWeeklyReport.setDistanceRunning(distanceRunning);
            nextWeeklyReport.setDistanceBicycle(distanceBicycle);

            nextWeeklyReport.setRecommendations(GetWeeklyRecommendations(nextWeeklyReport));

            // means this report is unique
            realm.executeTransaction(new Realm.Transaction() {
                @Override
                public void execute(Realm realm) {
                    // inside on execute method we are calling a method
                    // to copy to real m database from our modal class.
                    realm.copyToRealm(nextWeeklyReport);
                }
            });

            // atualiza a shared preference, sobre quando é que foi produzido o último relatório para hj
            UserProfileManager.getInstance().Set_Date_Of_Last_Weekly_Report(formattedDate);

            realm.close();
            Toast.makeText(activity, "AMaaS: Weekly Report Available.", Toast.LENGTH_LONG).show(); // For example


        } catch (Exception e) {
            Log.e(TAG,"Could not Produce Weekly Recommendations. Exception: " + e.toString());
            e.printStackTrace();
        }

        // apagar os registos de Atividade do último dia da BD.
        Log.d(TAG,"Deleting all activity records from the overall DB.");
        RealmDataBaseManager.getInstance().DeleteAllActivityRecordsFromDB();
    }

    /**
     * This method produces a list of recommendations
     *
     * @return List of strings, each of which containing a recommendation
     */
    @ReactMethod
    @Override
    public RealmList<String> GetWeeklyRecommendations(WeeklyReportDataModal weeklyReport) {
        RealmList<String> recommendations = new RealmList<String>();
        double metsTotais = weeklyReport.getMetsTotais();
        int tempoTotalDeAtividadeFisica = weeklyReport.getTotalAmountActiveActivityInMinutes();
        int totalAmountSedentaryHours = weeklyReport.getTotalAmountSedentaryHours(),
                totalAmountSedentaryMinutes = weeklyReport.getTotalAmountSedentaryMinutes();
        //List<String> recommendations = new ArrayList<String>();
        //recommendations.add("Recommendations still not implemented.");

        // 1: nível de risco. Fez atividades contra indicadas para o seu perfil
        // de risco de saúde?
        //recommendations.add("Recommendations still not implemented.");
        if (UserProfileManager.getInstance().Get_Health_Activity_Risk() == 3)
        {
            // não dar recomendações, porque o risco cardiorespiratório é elevado

        }
        else

        // 3: promoção de atividade física associada à mobilidade.
        // Quantos METs fez esta semana em comparação ? Há para comparar?
        // atingiu os objetivos de tempo e METs?
        if (UserProfileManager.getInstance().Get_Health_Activity_Risk() != 3)
        {
            // Só dar recomendações para risco cardiorespiratório abaixo de elevado.

            if ((metsTotais < 450 ))
            {recommendations.add("Seja mais ativo :) Você completou " + metsTotais+" METs nesta semana, que está abaixo dos 450 METs recomendados pelas autoridades de saúde.");}
            else if ((metsTotais >= 450 ) && (metsTotais < 900 ))
            {recommendations.add("Parabéns. Conseguiu atingir a quantidade de atividade física semanal que é recomendada pelas autoridades de saúde (450 METs), com " + metsTotais + " METs.");}
            else if ((metsTotais >= 900 ))
            {recommendations.add("Excelente. Conseguiu atingir e exceder a quantidade de atividade física semanal que é recomendada pelas autoridades de saúde (450 METs). Com os seus " + metsTotais +" METs, você conseguiu benefícios adicionais para a sua saúde nesta semana.");}


            if ((tempoTotalDeAtividadeFisica < 75) || ((tempoTotalDeAtividadeFisica < 150) && metsTotais < 450.))
            {recommendations.add("Você não foi ativo por tempo suficiente esta semana. Você fez " + tempoTotalDeAtividadeFisica +" minutos de atividade física no total. É recomendado que faça no mínimo 150 min./seman de atividade com intensidade moderada, ou 75 min./semana com intensidade vigorosa (você fez " + metsTotais + " METs em 450 mínimos).");}
            //else if ((tempoTotalDeAtividadeFisica < 150))
            //{recommendations.add("Você não foi ativo por tempo suficiente esta semana. Você fez " + tempoTotalDeAtividadeFisica +" minutos de atividade física no total. É recomendado que faça no mínimo 150 min./seman de atividade com intensidade moderada, ou 75 min./semana com intensidade vigorosa (você fez " + metsTotais + " METs em 450 mínimos).");}
            else if ((metsTotais >= 450) && ((double)weeklyReport.getTotalAmountActiveActivityInMinutes() * ((double)weeklyReport.getMetsIntVigorosaPercentage()/100.0) >= 75.0))
            {// só quem pode fazer atividades de risco 1, porque estas são atividades vigorosas
                recommendations.add("Parabéns! Não só você atingiu " + metsTotais + " METs esta semana, como completou pelo menos 75 minutos de atividade vigorosa durante esta semana.");
                if (UserProfileManager.getInstance().Get_Health_Activity_Risk() > 1 ) recommendations.add("Mas atenção: o seu nível de risco cardiorespiratório não é baixo, por favor consulte o seu médico para garantir que pode continuar a fazer as atividades que faz.");
            }
            else if ((metsTotais >= 450) && ((double)weeklyReport.getTotalAmountActiveActivityInMinutes() * ((double)weeklyReport.getMetsIntModeradaPercentage()/100.0) >= 150.0))
            { // só quem pode fazer atividades de risco 1 e 2, porque estas são atividades moderadas
                recommendations.add("Parabéns! Não só você atingiu " + metsTotais + " METs esta semana, como completou pelo menos 150 minutos de atividade moderada durante esta semana.");
                if (UserProfileManager.getInstance().Get_Health_Activity_Risk() > 2 ) recommendations.add("Mas atenção: o seu nível de risco cardiorespiratório não é baixo, por favor consulte o seu médico para garantir que pode continuar a fazer as atividades que faz.");
            }
            else if ((metsTotais >= 450) &&( (double)weeklyReport.getTotalAmountActiveActivityInMinutes() *  (double) ((weeklyReport.getMetsIntVigorosaPercentage() + weeklyReport.getMetsIntModeradaPercentage())/100.0) >= 150.0))
            {// só quem pode fazer atividades de risco 1, porque estas são atividades moderadas + vigorosas
                recommendations.add("Excelente!!! Você fez no mínimo 150 minutos de atividade física (moderada e vigorosa), e fez mais de "+metsTotais + "METs. Muito bom!");
                if (UserProfileManager.getInstance().Get_Health_Activity_Risk() > 1 ) recommendations.add("Mas atenção: o seu nível de risco cardiorespiratório não é baixo, por favor consulte o seu médico para garantir que pode continuar a fazer as atividades que faz.");
            }

            if ((metsTotais >= 900) && ((double)weeklyReport.getTotalAmountActiveActivityInMinutes() * ((double)weeklyReport.getMetsIntModeradaPercentage()/100.0) >= 300.0))
            {// só quem pode fazer atividades de risco 1 e 2, porque estas são atividades moderadas
                recommendations.add("Excelente!!! Você fez no mínimo 300 minutos de atividade física moderada, e fez mais de "+metsTotais + "METs. Brutal!");
                if (UserProfileManager.getInstance().Get_Health_Activity_Risk() > 2 ) recommendations.add("Mas atenção: o seu nível de risco cardiorespiratório não é baixo, por favor consulte o seu médico para garantir que pode continuar a fazer as atividades que faz.");
            }
            else if ((metsTotais >= 900) && ((double)weeklyReport.getTotalAmountActiveActivityInMinutes() * ((double)weeklyReport.getMetsIntVigorosaPercentage()/100.0) >= 150.0))
            {// só quem pode fazer atividades de risco 1, porque estas são atividades vigorosas
                recommendations.add("Excelente!!! Você fez no mínimo 150 minutos de atividade física vigorosa, e fez mais de "+metsTotais + "METs. Brutal!");
                if (UserProfileManager.getInstance().Get_Health_Activity_Risk() > 1 ) recommendations.add("Mas atenção: o seu nível de risco cardiorespiratório não é baixo, por favor consulte o seu médico para garantir que pode continuar a fazer as atividades que faz.");
            }
            else if ((metsTotais >= 900) &&( (double)weeklyReport.getTotalAmountActiveActivityInMinutes() *  (double) ((weeklyReport.getMetsIntVigorosaPercentage() + weeklyReport.getMetsIntModeradaPercentage())/100.0) >= 300.0))
            {// só quem pode fazer atividades de risco 1, porque estas são atividades moderadas + vigorosas
                recommendations.add("Excelente!!! Você fez no mínimo 300 minutos de atividade física (moderada e vigorosa), e fez mais de "+metsTotais + "METs. Brutal!");
                if (UserProfileManager.getInstance().Get_Health_Activity_Risk() > 1 ) recommendations.add("Mas atenção: o seu nível de risco cardiorespiratório não é baixo, por favor consulte o seu médico para garantir que pode continuar a fazer as atividades que faz.");
            }
        }


        WeeklyReportDataModal beforeLastWeeklyReport = GetPreviousWeekReport(weeklyReport.getId());
        long timeTmpMilli, hour, minute, sec;
        // 2: esta semana fez X de atividade sedentária. Como é que se compara com a semana antes
        // desta? Há para comparar?
        // redução do sedentarismo

        // se houver 2 relatórios para comparar, pode-se ver como é que se comparou o sedentarismo
        // com o a semana anterior

        // se não houver 2 relatórios, dizer
        if (beforeLastWeeklyReport == null) {
            recommendations.add("A quantidade de tempo sedentário para esta semana foi de " + totalAmountSedentaryHours + ":" + totalAmountSedentaryMinutes +
                    "H. Tente reduzir esta quantidade de tempo para seu benefício.");
        }
        else {
            if ((beforeLastWeeklyReport.getTotalAmountSedentaryMilliseconds() > weeklyReport.getTotalAmountSedentaryMilliseconds()))
            {
                timeTmpMilli = beforeLastWeeklyReport.getTotalAmountSedentaryMilliseconds() - weeklyReport.getTotalAmountSedentaryMilliseconds();
                sec = (int) timeTmpMilli / 1000;
                hour = sec / 3600;
                minute = (sec % 3600) / 60;
                sec = (sec % 3600) % 60;
                recommendations.add("Parabéns, você foi bem sucedido a reduzir a quantidade de tempo que passou em atividades sedentárias nesta semana. Você fez menos " + hour+":"+minute+":"+sec+"H do que na semana passada.");
            }
            else if ((beforeLastWeeklyReport.getTotalAmountSedentaryMilliseconds() < weeklyReport.getTotalAmountSedentaryMilliseconds()))
            {
                timeTmpMilli = weeklyReport.getTotalAmountSedentaryMilliseconds() - beforeLastWeeklyReport.getTotalAmountSedentaryMilliseconds();
                sec = (int) timeTmpMilli / 1000;
                hour = sec / 3600;
                minute = (sec % 3600) / 60;
                sec = (sec % 3600) % 60;
                recommendations.add("Tente ser menos sedentário. Você passou mais " + hour+":"+minute+":"+sec+"H do que na semana passada em atividades sedentárias.");
            }
            else {recommendations.add("Tente ser menos sedentário. Você passou sensivelmente a mesma quantidade de tempo do que na semana passada em atividades sedentárias: "+
                    weeklyReport.getTotalAmountSedentaryHours()+":"+weeklyReport.getTotalAmountSedentaryMinutes()+"H.");}

        }

        return recommendations;
    }
    /*
    totalAmountActiveActivityInMinutes
    metsIntModeradaPercentage
    metsIntVigorosaPercentage



    private long amountTimeStillMilliseconds = 0, amountTimeInVehicleMilliseconds = 0,
            amountTimeWalkingMilliseconds = 0,amountTimeRunningMilliseconds = 0,
            amountTimeOnBicycleMilliseconds = 0,totalAmountSedentaryMilliseconds = 0,
            totalAmountActiveActivityMilliseconds = 0;
    private int amountTimeStillHours = 0,amountTimeStillMinute = 0,amountTimeStillSeconds = 0,
            amountTimeInVehicleHours = 0,amountTimeInVehicleMinute = 0,amountTimeInVehicleSeconds = 0;
    private int amountTimeWalkingHours = 0,amountTimeWalkingMinute = 0,amountTimeWalkingSeconds = 0,
            amountTimeRunningHours = 0,amountTimeRunningMinute = 0,amountTimeRunningSeconds = 0,
            amountTimeOnBicycleHours = 0,amountTimeOnBicycleMinute = 0,amountTimeOnBicycleSeconds = 0;
    private int totalAmountSedentaryHours = 0, totalAmountSedentaryMinutes = 0,
            totalAmountActiveActivityInMinutes = 0;
    private double metsTotais = 0, metsIntBaixa = 0, metsIntModerada = 0, metsIntVigorosa = 0;
    private int metsIntBaixaPercentage = 0,metsIntModeradaPercentage = 0,metsIntVigorosaPercentage = 0;
    private int metsIntBaixaBicyclePercentage = 0,metsIntBaixaWalkingPercentage = 0,
            metsIntBaixaRunningPercentage = 0;
    private int metsIntModeradaBicyclePercentage = 0,metsIntModeradaWalkingPercentage = 0,
            metsIntModeradaRunningPercentage = 0;
    private int metsIntVigorosaBicyclePercentage = 0,metsIntVigorosaWalkingPercentage = 0,
            metsIntVigorosaRunningPercentage = 0;
    private double distanceWalking = 0, distanceRunning = 0, distanceBicycle = 0;
    private String dateOfReport = "";
     */

    @ReactMethod
    @Override
    public RealmList<String> GetWeeklyRecommendations() {
        WeeklyReportDataModal lastWeeksReport = GetLastWeeklyReport();

        if (lastWeeksReport == null)
            return null;
        else {
            RealmList<String> ret = GetWeeklyRecommendations(lastWeeksReport);
            lastWeeksReport.setRecommendations(ret);
            return ret;
        }
    }

    @ReactMethod
    @Override
    public WeeklyReportDataModal GetLastWeeklyReport() {
        Log.d(TAG, "Getting the most recent weekly health report ...");
        Realm realm;
        WeeklyReportDataModal m = null;

        try {
            if (activity == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(activity);
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

            realm = Realm.getDefaultInstance();

            
            m = realm.where(WeeklyReportDataModal.class)
                    .sort("id", Sort.DESCENDING)
                    .findFirst();

            realm.close();
            

        } catch (Exception e) {
            Log.e(TAG,"Could not get last available weekly report. Exception: " + e.toString());
            e.printStackTrace();
        }

        if(m != null){
            return m;
        }
        else {
            return null;
        }
    }


    //
    //

    /**
     * I need to get the report from the position X. Index goes from 0 to the number of reports in
     * the database. Example: if you pass index 0, it will get you the most recent report; with
     * index = 1, you will get the before last index; index = 2, you'll get the weekly report from
     * three weeks ago.
     *
     * @param index [0, reportsMaxSize]
     * @return WeeklyReportDataModal (report in the index position, or null
     */
    @ReactMethod
    @Override
    public WeeklyReportDataModal GetWeeklyReport(int index) {
        Log.d(TAG, "Getting the weekly health report at position " + index + " ...");
        Realm realm;
        WeeklyReportDataModal report= null;

        try {
            if (activity == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(activity);
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

            realm = Realm.getDefaultInstance();

            if (index <= realm.where(WeeklyReportDataModal.class).findAll().size()) {
                //WeeklyReportDataModal modal = realm.where(WeeklyReportDataModal.class).equalTo("id", position).findFirst();

                List<WeeklyReportDataModal> weeklyReports = realm.where(WeeklyReportDataModal.class).findAll()
                        .sort("id", Sort.DESCENDING);
                ListIterator<WeeklyReportDataModal> it = weeklyReports.listIterator();
                int pointer = 0;

                while ((it.hasNext()) && (pointer <= index))
                {
                    report = it.next();
                    pointer ++;
                }
            }



            realm.close();


        } catch (Exception e) {
            Log.e(TAG,"Could not get the weekly report at the specified index " + index +". Exception: " + e.toString());
            e.printStackTrace();
        }

        return report;
    }
    @ReactMethod
    @Override
    public void ReadAllWeeklyReportsFromDBIntoReactNative(Callback successCallback) throws JSONException {
        // guarantee the database has already been created; if not, get app context stored in HAR module
        try {
            if (activity == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(activity);
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

            Realm realm = Realm.getDefaultInstance();
            List<WeeklyReportDataModal> modals = new ArrayList<WeeklyReportDataModal>();
            // on below line we are getting data from realm database in our list.
            modals = realm.where(WeeklyReportDataModal.class).findAll();

            WritableArray array = new WritableNativeArray();
            JsonObject jsonObject = null;
            for (WeeklyReportDataModal m : modals) {
                jsonObject = new JsonObject();
                jsonObject.addProperty("id", m.getId());
                jsonObject.addProperty("userID", m.getUserID());
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

        } catch (Exception e) {
            Log.e(TAG,"Could not read the database of weekly reports into react native method. Exception: " + e.toString());
            e.printStackTrace();
        }
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

    private void VerifyIfWeeklyReportExistsOnThisDate(String date) {
        //Date currentDate = Calendar.getInstance().getTime();
        //SimpleDateFormat df = new SimpleDateFormat("dd-MMM-yyyy", Locale.getDefault());
        //String formattedDate = df.format(currentDate);
        Log.d(TAG, "Verifying that the report we're trying to produce does not already exist ...");
        Realm realm;
        WeeklyReportDataModal m = null;

        try {
            if (activity == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(activity);
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

            realm = Realm.getDefaultInstance();

            boolean foundReports=true;
            while (foundReports) {
                WeeklyReportDataModal existentWeeklyReport = realm.where(WeeklyReportDataModal.class).equalTo("dateOfReport", date).findFirst();
                if (existentWeeklyReport != null) {
                    Log.d(TAG, "There is already one weekly report at this date. Removing it before insertion...");

                    realm.executeTransaction(new Realm.Transaction() {
                        @Override
                        public void execute(Realm realm) {
                            existentWeeklyReport.deleteFromRealm();
                        }
                    });
                }
                else foundReports = false;
            }

            realm.close();
        } catch (Exception e) {
            Log.e(TAG,"Could not get last available weekly report. Exception: " + e.toString());
            e.printStackTrace();
        }
    }

    private WeeklyReportDataModal GetPreviousWeekReport(long currentReportID) {
        //Date currentDate = Calendar.getInstance().getTime();
        //SimpleDateFormat df = new SimpleDateFormat("dd-MMM-yyyy", Locale.getDefault());
        //String formattedDate = df.format(currentDate);
        Log.d(TAG, "Verifying if there is a report before the report passed as parameter " +
                "to compare statistics with");
        Realm realm;
        WeeklyReportDataModal m = null;

        try {
            if (activity == null)
            {
                Realm.init(Realm.getApplicationContext());
            }
            else {
                Realm.init(activity);
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

            realm = Realm.getDefaultInstance();

            List<WeeklyReportDataModal> weekReports = realm.where(WeeklyReportDataModal.class).findAll()
                    .sort("id", Sort.DESCENDING);

            ListIterator<WeeklyReportDataModal> it = weekReports.listIterator();

            if (it.hasNext()) {
                WeeklyReportDataModal report = it.next();

                if (report.getId() == currentReportID) {
                    // then it's the next one you want.
                    if (it.hasNext()) {
                        report = it.next();
                    }
                    else {
                        realm.close();
                        return null;
                    }
                }
                else {
                    // its this one I want
                    realm.close();
                    return report;
                }
            }

            realm.close();

        } catch (Exception e) {
            Log.e(TAG,"Could not get last available weekly report. Exception: " + e.toString());
            e.printStackTrace();
        }

        return null;
    }
}
