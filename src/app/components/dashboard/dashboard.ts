import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, AfterViewInit {

  today = new Date();

  stats = {
    totalReservas: 5,
    habitacionesDisponibles: 5,
    ingresosMes: 316550,
    totalClientes: 5,
    confirmadas: 3,
    pendientes: 1,
    canceladas: 1
  };

  ultimasReservas = [
    { idReserva: 1, cliente: 'Juan Perez',   recepcionista: 'Kelvin Garcia',  fecha: new Date('2026-05-10'), estado: 'Confirmada', total: 39550  },
    { idReserva: 2, cliente: 'Maria Lopez',  recepcionista: 'Gerald Araya',   fecha: new Date('2026-06-01'), estado: 'Pendiente',  total: 62150  },
    { idReserva: 3, cliente: 'Carlos Ramirez',recepcionista: 'Andy Alvarado', fecha: new Date('2026-07-15'), estado: 'Confirmada', total: 84750  },
    { idReserva: 4, cliente: 'Laura Jimenez', recepcionista: 'Kelvin Garcia', fecha: new Date('2026-08-01'), estado: 'Cancelada',  total: 50850  },
    { idReserva: 5, cliente: 'Pedro Castro',  recepcionista: 'Gerald Araya',  fecha: new Date('2026-09-10'), estado: 'Confirmada', total: 79100  }
  ];

  habitaciones = [
    { numero: '101', tipo: 'Sencilla', estado: 'Disponible'    },
    { numero: '102', tipo: 'Sencilla', estado: 'Ocupada'       },
    { numero: '201', tipo: 'Doble',    estado: 'Disponible'    },
    { numero: '202', tipo: 'Doble',    estado: 'Ocupada'       },
    { numero: '301', tipo: 'Suite',    estado: 'Mantenimiento' },
    { numero: '302', tipo: 'Suite',    estado: 'Disponible'    }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initDonut();
    this.initBarChart();
  }

  private initDonut(): void {
    const ctx = document.getElementById('chartEstado') as HTMLCanvasElement;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Confirmadas', 'Pendientes', 'Canceladas'],
        datasets: [{
          data: [this.stats.confirmadas, this.stats.pendientes, this.stats.canceladas],
          backgroundColor: ['#1D9E75', '#BA7517', '#E24B4A'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`
        }}}
      }
    });
  }

  private initBarChart(): void {
    const ctx = document.getElementById('chartIngresos') as HTMLCanvasElement;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Ingresos (₡)',
          data: [45000, 78000, 62000, 95000, 110000, 316550],
          backgroundColor: '#378ADD',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#888780' } },
          y: { grid: { color: '#D3D1C7' }, ticks: {
            color: '#888780',
            callback: (v) => '₡' + Number(v).toLocaleString()
          }}
        }
      }
    });
  }
}