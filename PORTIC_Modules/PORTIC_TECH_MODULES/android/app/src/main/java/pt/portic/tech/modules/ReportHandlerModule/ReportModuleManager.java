/**
 *  Software disponibilizado no âmbito do projeto TECH pelo PORTIC, Instituto Politécnico do Porto.
 *
 *  Os direitos de autor são exclusivamente retidos pelo PORTIC, e qualquer partilha
 *  deste código carece de autorização explicita por parte do autor responsável.
 *
 *  Autor:      Dr.Eng. Francisco Xavier dos Santos Fonseca
 *  Nº Ordem:   84598
 *  Data:       2021.Dec.06
 *  Email:      xavier.fonseca@portic.ipp.pt
 */

package pt.portic.tech.modules.ReportHandlerModule;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import pt.portic.tech.modules.Public_API_ReportManager_Module;

public class ReportModuleManager extends ReactContextBaseJavaModule implements Public_API_ReportManager_Module {



    @NonNull
    @Override
    public String getName() {
        return "ReportModuleManager";
    }
}
