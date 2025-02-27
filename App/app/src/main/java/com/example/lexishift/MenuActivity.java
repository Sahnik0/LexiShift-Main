package com.example.lexishift;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class MenuActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        setupButtons();
    }

    private void setupButtons() {
        Button btnPage1 = findViewById(R.id.btnPage1);
        Button btnPage2 = findViewById(R.id.btnPage2);
        Button btnPage3 = findViewById(R.id.btnPage3);
        Button btnPage4 = findViewById(R.id.btnPage4);
        Button btnPage5 = findViewById(R.id.btnPage5);
        Button btnPage6 = findViewById(R.id.btnPage6);

        btnPage1.setOnClickListener(v -> startActivity(new Intent(MenuActivity.this, Page1Activity.class)));
        btnPage2.setOnClickListener(v -> startActivity(new Intent(MenuActivity.this, Page2Activity.class)));
        btnPage3.setOnClickListener(v -> startActivity(new Intent(MenuActivity.this, Page3Activity.class)));
        btnPage4.setOnClickListener(v -> startActivity(new Intent(MenuActivity.this, Page4Activity.class)));
        btnPage5.setOnClickListener(v -> startActivity(new Intent(MenuActivity.this, Page5Activity.class)));
        btnPage6.setOnClickListener(v -> startActivity(new Intent(MenuActivity.this, Page6Activity.class)));
    }
}