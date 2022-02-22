package pt.portic.tech.modules.RecommendationsModule;

import io.realm.RealmList;
import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

public class WeeklyReportDataModal extends RealmObject {
    // on below line we are creating our variables
    // and with are using primary key for our id.
    @PrimaryKey
    private long id = 0;
    private String userID = "";
    private RealmList<String> recommendations;

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



    public WeeklyReportDataModal() {}

    public String getUserID() {return userID;}
    public void setUserID(String userID) {this.userID = userID;}
    public long getId() {  return id; }
    public void setId(long id) {this.id = id; }
    public RealmList<String> getRecommendations() {return recommendations;}
    public void setRecommendations(RealmList<String> recommendations) {this.recommendations = recommendations;}



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
