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

import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class HealthReportDataModal extends RealmObject {
    /** *******************************************************
     * Mold responsible for the format of the health reports
     * ********************************************************/

    @PrimaryKey
    private long id;
    private String userID;
    private long amountTimeStillMilliseconds, amountTimeInVehicleMilliseconds,
            amountTimeWalkingMilliseconds,amountTimeRunningMilliseconds,
            amountTimeOnBicycleMilliseconds,totalAmountSedentaryMilliseconds,
            totalAmountActiveActivityMilliseconds;
    private int amountTimeStillHours,amountTimeStillMinute,amountTimeStillSeconds,
            amountTimeInVehicleHours,amountTimeInVehicleMinute,amountTimeInVehicleSeconds;
    private int amountTimeWalkingHours,amountTimeWalkingMinute,amountTimeWalkingSeconds,
            amountTimeRunningHours,amountTimeRunningMinute,amountTimeRunningSeconds,
            amountTimeOnBicycleHours,amountTimeOnBicycleMinute,amountTimeOnBicycleSeconds;
    private int totalAmountSedentaryHours, totalAmountSedentaryMinutes,
            totalAmountActiveActivityInMinutes;
    private double metsTotais, metsIntBaixa, metsIntModerada, metsIntVigorosa;
    private int metsIntBaixaPercentage,metsIntModeradaPercentage,metsIntVigorosaPercentage;
    private int metsIntBaixaBicyclePercentage,metsIntBaixaWalkingPercentage,
            metsIntBaixaRunningPercentage;
    private int metsIntModeradaBicyclePercentage,metsIntModeradaWalkingPercentage,
            metsIntModeradaRunningPercentage;
    private int metsIntVigorosaBicyclePercentage,metsIntVigorosaWalkingPercentage,
            metsIntVigorosaRunningPercentage;
    private double distanceWalking, distanceRunning, distanceBicycle;
    private String dateOfReport;
    // creating an empty constructor.
    public HealthReportDataModal() {}

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
    public int getAmountTimeStillHours() {return this.amountTimeStillHours;}
    public void setAmountTimeStillHours(int val){this.amountTimeStillHours = val;}
    public int getAmountTimeStillMinute(){return amountTimeStillMinute;}
    public void setAmountTimeStillMinute(int val){this.amountTimeStillMinute=val;}
    public int getAmountTimeStillSeconds(){return this.amountTimeStillSeconds;}
    public void setAmountTimeStillSeconds(int val){this.amountTimeStillSeconds = val;}
    public int getAmountTimeInVehicleHours(){return this.amountTimeInVehicleHours;}
    public void setAmountTimeInVehicleHours(int val){this.amountTimeInVehicleHours=val;}
    public int getAmountTimeInVehicleMinute(){return this.amountTimeInVehicleMinute;}
    public void setAmountTimeInVehicleMinute(int val){this.amountTimeInVehicleMinute = val;}
    public int getAmountTimeInVehicleSeconds(){return this.amountTimeInVehicleSeconds;}
    public void setAmountTimeInVehicleSeconds(int val){this.amountTimeInVehicleSeconds = val;}
    public int getAmountTimeOnBicycleHours() {return amountTimeOnBicycleHours;}
    public void setAmountTimeOnBicycleHours(int amountTimeOnBicycleHours)
    {this.amountTimeOnBicycleHours = amountTimeOnBicycleHours;}
    public int getAmountTimeWalkingMinute() {return amountTimeWalkingMinute;}
    public void setAmountTimeWalkingMinute(int amountTimeWalkingMinute)
    {this.amountTimeWalkingMinute = amountTimeWalkingMinute;}
    public int getAmountTimeWalkingSeconds() {return amountTimeWalkingSeconds;}
    public void setAmountTimeWalkingSeconds(int amountTimeWalkingSeconds)
    {this.amountTimeWalkingSeconds = amountTimeWalkingSeconds;}
    public int getAmountTimeRunningHours() {return amountTimeRunningHours;}
    public void setAmountTimeRunningHours(int amountTimeRunningHours)
    {this.amountTimeRunningHours = amountTimeRunningHours;}
    public int getAmountTimeRunningMinute() {return amountTimeRunningMinute;}
    public void setAmountTimeRunningMinute(int amountTimeRunningMinute)
    {this.amountTimeRunningMinute = amountTimeRunningMinute;}
    public int getAmountTimeRunningSeconds() {return amountTimeRunningSeconds;}
    public void setAmountTimeRunningSeconds(int amountTimeRunningSeconds)
    {this.amountTimeRunningSeconds = amountTimeRunningSeconds;}
    public int getAmountTimeOnBicycleMinute() {return amountTimeOnBicycleMinute;}
    public void setAmountTimeOnBicycleMinute(int amountTimeOnBicycleMinute)
    {this.amountTimeOnBicycleMinute = amountTimeOnBicycleMinute; }
    public int getAmountTimeOnBicycleSeconds() {return amountTimeOnBicycleSeconds;}
    public void setAmountTimeOnBicycleSeconds(int amountTimeOnBicycleSeconds)
    {this.amountTimeOnBicycleSeconds = amountTimeOnBicycleSeconds;}
    public int getAmountTimeWalkingHours() {return amountTimeWalkingHours;}
    public void setAmountTimeWalkingHours(int amountTimeWalkingHours)
    {this.amountTimeWalkingHours = amountTimeWalkingHours;}
    public int getTotalAmountSedentaryHours() {return totalAmountSedentaryHours;}
    public void setTotalAmountSedentaryHours(int totalAmountSedentaryHours)
    {this.totalAmountSedentaryHours = totalAmountSedentaryHours;}
    public int getTotalAmountSedentaryMinutes() {return totalAmountSedentaryMinutes;}
    public void setTotalAmountSedentaryMinutes(int totalAmountSedentaryMinutes)
    {this.totalAmountSedentaryMinutes = totalAmountSedentaryMinutes;}
    public int getTotalAmountActiveActivityInMinutes(){return totalAmountActiveActivityInMinutes;}
    public void setTotalAmountActiveActivityInMinutes(int totalAmountActiveActivityInMinutes)
    {this.totalAmountActiveActivityInMinutes = totalAmountActiveActivityInMinutes;}
    public double getMetsTotais() {return metsTotais;}
    public void setMetsTotais(double metsTotais) {this.metsTotais = metsTotais; }
    public double getMetsIntBaixa() {return metsIntBaixa;}
    public void setMetsIntBaixa(double metsIntBaixa) {this.metsIntBaixa = metsIntBaixa;}
    public double getMetsIntModerada() {return metsIntModerada;}
    public void setMetsIntModerada(double metsIntModerada) {this.metsIntModerada = metsIntModerada;}
    public double getMetsIntVigorosa() {return metsIntVigorosa;}
    public void setMetsIntVigorosa(double metsIntVigorosa) {this.metsIntVigorosa = metsIntVigorosa;}
    public int getMetsIntBaixaPercentage() {return metsIntBaixaPercentage;}
    public void setMetsIntBaixaPercentage(int metsIntBaixaPercentage)
    {this.metsIntBaixaPercentage = metsIntBaixaPercentage;    }
    public int getMetsIntModeradaPercentage() {return metsIntModeradaPercentage;}
    public void setMetsIntModeradaPercentage(int metsIntModeradaPercentage)
    {this.metsIntModeradaPercentage = metsIntModeradaPercentage; }
    public int getMetsIntVigorosaPercentage() {return metsIntVigorosaPercentage; }
    public void setMetsIntVigorosaPercentage(int metsIntVigorosaPercentage)
    {this.metsIntVigorosaPercentage = metsIntVigorosaPercentage; }
    public int getMetsIntBaixaBicyclePercentage() {return metsIntBaixaBicyclePercentage;}
    public void setMetsIntBaixaBicyclePercentage(int metsIntBaixaBicyclePercentage)
    { this.metsIntBaixaBicyclePercentage = metsIntBaixaBicyclePercentage; }
    public int getMetsIntBaixaWalkingPercentage() {return metsIntBaixaWalkingPercentage;}
    public void setMetsIntBaixaWalkingPercentage(int metsIntBaixaWalkingPercentage)
    {this.metsIntBaixaWalkingPercentage = metsIntBaixaWalkingPercentage; }
    public int getMetsIntBaixaRunningPercentage() { return metsIntBaixaRunningPercentage; }
    public void setMetsIntBaixaRunningPercentage(int metsIntBaixaRunningPercentage)
    {this.metsIntBaixaRunningPercentage = metsIntBaixaRunningPercentage;}
    public int getMetsIntModeradaBicyclePercentage() {return metsIntModeradaBicyclePercentage;}
    public void setMetsIntModeradaBicyclePercentage(int metsIntModeradaBicyclePercentage)
    {this.metsIntModeradaBicyclePercentage = metsIntModeradaBicyclePercentage;}
    public int getMetsIntModeradaWalkingPercentage() {return metsIntModeradaWalkingPercentage; }
    public void setMetsIntModeradaWalkingPercentage(int metsIntModeradaWalkingPercentage)
    {this.metsIntModeradaWalkingPercentage = metsIntModeradaWalkingPercentage;}
    public int getMetsIntModeradaRunningPercentage() {return metsIntModeradaRunningPercentage; }
    public void setMetsIntModeradaRunningPercentage(int metsIntModeradaRunningPercentage)
    {this.metsIntModeradaRunningPercentage = metsIntModeradaRunningPercentage;}
    public int getMetsIntVigorosaBicyclePercentage() {return metsIntVigorosaBicyclePercentage;}
    public void setMetsIntVigorosaBicyclePercentage(int metsIntVigorosaBicyclePercentage)
    {this.metsIntVigorosaBicyclePercentage = metsIntVigorosaBicyclePercentage;}
    public int getMetsIntVigorosaWalkingPercentage() {return metsIntVigorosaWalkingPercentage;}
    public void setMetsIntVigorosaWalkingPercentage(int metsIntVigorosaWalkingPercentage)
    {this.metsIntVigorosaWalkingPercentage = metsIntVigorosaWalkingPercentage;}
    public int getMetsIntVigorosaRunningPercentage() {return metsIntVigorosaRunningPercentage;}
    public void setMetsIntVigorosaRunningPercentage(int metsIntVigorosaRunningPercentage)
    {this.metsIntVigorosaRunningPercentage = metsIntVigorosaRunningPercentage;}
    public long getAmountTimeStillMilliseconds() {return amountTimeStillMilliseconds;}
    public void setAmountTimeStillMilliseconds(long amountTimeStillMilliseconds)
    {this.amountTimeStillMilliseconds = amountTimeStillMilliseconds;}
    public long getAmountTimeInVehicleMilliseconds() {return amountTimeInVehicleMilliseconds; }
    public void setAmountTimeInVehicleMilliseconds(long amountTimeInVehicleMilliseconds)
    { this.amountTimeInVehicleMilliseconds = amountTimeInVehicleMilliseconds; }
    public long getAmountTimeWalkingMilliseconds() {return amountTimeWalkingMilliseconds;}
    public void setAmountTimeWalkingMilliseconds(long amountTimeWalkingMilliseconds)
    {this.amountTimeWalkingMilliseconds = amountTimeWalkingMilliseconds; }
    public long getAmountTimeRunningMilliseconds() {return amountTimeRunningMilliseconds;    }
    public void setAmountTimeRunningMilliseconds(long amountTimeRunningMilliseconds)
    {this.amountTimeRunningMilliseconds = amountTimeRunningMilliseconds;}
    public long getAmountTimeOnBicycleMilliseconds() {return amountTimeOnBicycleMilliseconds;}
    public void setAmountTimeOnBicycleMilliseconds(long amountTimeOnBicycleMilliseconds)
    {this.amountTimeOnBicycleMilliseconds = amountTimeOnBicycleMilliseconds;}
    public long getTotalAmountSedentaryMilliseconds() {return totalAmountSedentaryMilliseconds;   }
    public void setTotalAmountSedentaryMilliseconds(long totalAmountSedentaryMilliseconds)
    {this.totalAmountSedentaryMilliseconds = totalAmountSedentaryMilliseconds; }
    public long getTotalAmountActiveActivityMilliseconds()
    {return totalAmountActiveActivityMilliseconds;}
    public void setTotalAmountActiveActivityMilliseconds(long totalAmountActiveActivityMilliseconds)
    {this.totalAmountActiveActivityMilliseconds = totalAmountActiveActivityMilliseconds; }
    public double getDistanceWalking() {return distanceWalking;}
    public void setDistanceWalking(double distanceWalking)
    {this.distanceWalking = distanceWalking;    }
    public double getDistanceRunning() {return distanceRunning;}
    public void setDistanceRunning(double distanceRunning)
    {this.distanceRunning = distanceRunning; }
    public double getDistanceBicycle() {return distanceBicycle;    }
    public void setDistanceBicycle(double distanceBicycle)
    {this.distanceBicycle = distanceBicycle;}
    public String getDateOfReport() {return dateOfReport;    }
    public void setDateOfReport(String dateOfReport) {this.dateOfReport = dateOfReport;   }
}

