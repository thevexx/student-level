import { Component, ViewChild, OnInit } from '@angular/core';
import { FirebaseDatabase } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  materials = [
    {
      'name': 'HTML',
      'value': 3
    },
    {
      'name': 'CSS',
      'value': 2
    },
    {
      'name': 'JS',
      'value': 4
    },
    {
      'name': 'Algo',
      'value': 1
    }
  ];
  multi: any[];

  red = '#A10A28';
  yellow = '#C7B42C';
  green = '#5AA454';
  blue = '#3333FF';

  view: any[] = [800, 500];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Materials';
  showYAxisLabel = true;
  yAxisLabel = 'Levels';
  intervalId;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  students;
  student: any = {};
  idStudent;
  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {
    this.route.params.subscribe(params => { this.idStudent = params.i; console.log(params); this.ngOnInit(); });
  }

  ngOnInit() {

    this.students = this.db.list('students').valueChanges();
    this.students.subscribe(st => {
      console.log(st);
      if (st[this.idStudent]) {
        this.student = st[this.idStudent];
        this.levelSelected(this.student.level);
        if (!this.student.materials && !this.student.level) {
          this.student['level'] = 0;
          this.student['materials'] = [];
        }
      }
    });
  }

  levelSelected(lvl) {
    lvl = Number.parseInt(lvl, 0);
    if (this.student.materials) {

      for (let i = 0; i < this.student.materials.length; i++) {
        if (this.student.materials[i].value === lvl) {
          this.colorScheme.domain[i] = this.green;
        }
        if (this.student.materials[i].value > lvl) {
          this.colorScheme.domain[i] = this.blue;
        } else {
          if (lvl - this.student.materials[i].value === 1) {
            this.colorScheme.domain[i] = this.yellow;
          }
          if (lvl - this.student.materials[i].value === 2) {
            this.colorScheme.domain[i] = this.red;
          }
        }
      }
      this.colorScheme.domain = [...this.colorScheme.domain];
      this.student.materials = [...this.student.materials];
      this.student['level'] = lvl;

    }
  }

  deleteMaterial(mat) {
    this.student.materials = this.student.materials.filter(elem => elem !== mat);
    this.student.materials = [...this.student.materials];
  }

  addMaterial(name, val) {
    if (name && val) {
      this.student.materials.push({ name: name, value: val });
      this.student.materials = [...this.student.materials];
      this.student['materials'] = this.student.materials;
    }
  }
  addStudent(name, lastname) {
    this.db.list('students').push({ name, lastname });
  }

  save() {
    console.log(this.student);
    this.db.list('students').update(this.idStudent, this.student);
  }

}
