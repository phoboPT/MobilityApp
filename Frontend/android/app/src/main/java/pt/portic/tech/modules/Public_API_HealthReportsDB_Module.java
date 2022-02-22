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
package pt.portic.tech.modules;

import android.content.Context;
import com.facebook.react.bridge.Callback;
import org.json.JSONException;

import java.util.Date;
import java.util.List;
import pt.portic.tech.modules.HealthReportsDB_Module.HealthReportDataModal;

public interface Public_API_HealthReportsDB_Module {

    void CreateDB (Context context);
    void AddDataToDB(String userID, int amountTimeStillHours,int amountTimeStillMinute,
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
                     long amountTimmeInVehicleMilliseconds, long amountTimeWalkingMilliseconds,
                     long amountTimeRunningMilliseconds, long amountTimeOnBicycleMilliseconds,
                     long totalAmountSedentaryMilliseconds, long totalAmountActiveActivityMilliseconds,
                     double distanceWalking, double distanceRunning, double distanceBicycle);
    List<HealthReportDataModal> ReadAllDataFromDB();
    HealthReportDataModal ReadLastRecordFromDB();
    void ReadAllDataFromDBIntoReactNative(Callback successCallback) throws JSONException;
    void UpdateDataInDB(int position, String userID, int amountTimeStillHours,int amountTimeStillMinute,
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
                        long amountTimmeInVehicleMilliseconds, long amountTimeWalkingMilliseconds,
                        long amountTimeRunningMilliseconds, long amountTimeOnBicycleMilliseconds,
                        long totalAmountSedentaryMilliseconds, long totalAmountActiveActivityMilliseconds,
                        double distanceWalking, double distanceRunning, double distanceBicycle,
                        Date date);
    void DeleteRecordFromDB(int position);
    void DeleteAllRecordsFromDB();
}
