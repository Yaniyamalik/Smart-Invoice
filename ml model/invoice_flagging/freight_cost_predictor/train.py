import joblib
from pathlib import Path
from data_preprocessing import data_loading, feature_preparation, train_test_splitting, features_scalling
from finding_best_model import linear_regression_model, decision_tree_model, random_forest_model,gradient_boosting_regressor, model_evaluation, select_best_model

def main():
    path = "data/inventory.db"
    model_dir=Path("models")
    model_dir.mkdir(exist_ok=True)

    df=data_loading(path)#data loading and coverted to data frame

    X,Y=feature_preparation(df)
    

    x_train,x_test,y_train,y_test=train_test_splitting(X,Y)
    x_train_scaled,x_test_scaled=features_scalling(x_train,x_test)

    lr_model=linear_regression_model(x_train_scaled,y_train)
    dt_model=decision_tree_model(x_train,y_train)
    rf_model=random_forest_model(x_train,y_train)
    gb_model=gradient_boosting_regressor(x_train,y_train)

    results=[]
    results.append(model_evaluation(lr_model,x_test_scaled,y_test,"Linear Regression"))
    results.append(model_evaluation(dt_model,x_test,y_test,"Decision Tree"))
    results.append(model_evaluation(rf_model,x_test,y_test,"Random Forest"))
    results.append(model_evaluation(gb_model,x_test,y_test,"Gradient Boosting"))




    models={
        "Linear Regression":lr_model,
        "Decision Tree":dt_model,
        "Random Forest":rf_model,
        "Gradient Boosting":gb_model
    }
    best_model_info = select_best_model(results)
    best_model_name = best_model_info["model_name"]

    best_model = models[best_model_name]


    model_path=model_dir/"freight_model.pkl"
    joblib.dump(best_model, model_path)

    print(f"best model is {best_model_name}")
    print(f"best model path is {model_path}")




if __name__ == "__main__":
    main()