// src/screens/AdminHome.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminHome({ usuario, navigation, onLogout }) {
  return (
    <View style={styles.wrapper}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.logoContainer}>
          {/* Aquí puedes poner tu logo/pingüino */}
          <Text style={styles.logoText}>Gestuino</Text>
        </View>
        <View style={styles.nav}>
          {[
            { label: 'Dashboard', route: 'AdminHome' },
            { label: 'Reportes', route: 'Reportes' },
            { label: 'Inventario', route: 'Inventario' },
            { label: 'Menús', route: 'Menu' },
            { label: 'Configuración', route: 'Configuraciones' },
          ].map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              style={[
                styles.navItem,
                item.route === 'AdminHome' && styles.navItemActive,
              ]}
            >
              <Text style={styles.navText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Bienvenido, <Text style={styles.username}>{usuario.nombre}</Text>
            </Text>
            <Text style={styles.status}>
              Estado del sistema:{' '}
              <Text style={styles.online}>● Operativo</Text>
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.iconWrapper}>
              <Feather name="bell" size={24} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
            >
              <MaterialIcons
                name="logout"
                size={20}
              />
              <Text style={styles.logoutText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Métricas */}
        <View style={styles.metricsGrid}>
          {[
            {
              label: 'Ventas Hoy',
              value: '$2,450',
              progress: '75%',
              footer: '+18% vs ayer',
              icon: <MaterialIcons name="attach-money" size={20} />,
              iconBg: '#FFEDD5',
            },
            {
              label: 'Ocupación',
              value: '75%',
              progress: '66%',
              footer: '28/36 mesas',
              icon: <MaterialIcons name="table-bar" size={20} />,
              iconBg: '#FFEDD5',
            },
            {
              label: 'Inventario Crítico',
              value: '4 items',
              chips: ['Filete', 'Vino Tinto'],
              icon: <MaterialIcons name="inventory" size={20} />,
              iconBg: '#FFEDD5',
            },
            {
              label: 'Reservas',
              value: '15',
              progress: '50%',
              footer: 'Próxima: 20:30h',
              icon: <MaterialIcons name="event" size={20} />,
              iconBg: '#FFEDD5',
            },
          ].map((m, i) => (
            <TouchableOpacity key={i} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <View>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                  <Text style={styles.metricValue}>{m.value}</Text>
                </View>
                <View style={[styles.metricIcon, { backgroundColor: m.iconBg }]}>
                  {m.icon}
                </View>
              </View>

              {m.chips ? (
                <View style={styles.chipsContainer}>
                  {m.chips.map((chip) => (
                    <View key={chip} style={styles.chip}>
                      <Text style={styles.chipText}>{chip}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.metricFooter}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: m.progress },
                      ]}
                    />
                  </View>
                  <Text style={styles.metricFooterText}>{m.footer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Gráfico y Acciones */}
        <View style={styles.contentGrid}>
          {/* Gráfico */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Tendencia de Ventas</Text>
              <View style={styles.chartTabs}>
                {['7D', '30D', 'Custom'].map((t) => (
                  <TouchableOpacity key={t} style={styles.chartTab}>
                    <Text
                      style={[
                        styles.chartTabText,
                        t === 'Custom' && styles.chartTabActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.chartPlaceholder}>
              <Text>[Área para gráfico interactivo]</Text>
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Acciones Prioritarias</Text>
            {[
              {
                label: 'Actualizar menú del día',
                badge: 'Pendiente',
                icon: <MaterialIcons name="update" size={20} />,
                badgeBg: '#FFEDD5',
                badgeTextColor: '#C2410C',
              },
              {
                label: 'Revisar turnos',
                badge: '3 cambios',
                icon: <MaterialIcons name="schedule" size={20} />,
                badgeBg: '#FEE2E2',
                badgeTextColor: '#991B1B',
              },
              {
                label: 'Alertas de stock',
                badge: '2 críticas',
                icon: <MaterialIcons name="inventory" size={20} />,
                badgeBg: '#FEE2E2',
                badgeTextColor: '#991B1B',
              },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={styles.actionItem}>
                <View style={styles.actionInfo}>
                  <View style={[styles.actionIconBg, { backgroundColor: a.badgeBg }]}>
                    {a.icon}
                  </View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </View>
                <View style={[styles.actionBadge, { backgroundColor: a.badgeBg }]}>
                  <Text style={[styles.actionBadgeText, { color: a.badgeTextColor }]}>
                    {a.badge}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    paddingTop: 24,
  },
  logoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  nav: {
    padding: 16,
  },
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  navItemActive: {
    backgroundColor: '#FFFAF7',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  navText: {
    color: '#374151',
    fontWeight: '500',
  },

  mainContent: {
    flexGrow: 1,
    marginLeft: 280,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: -12,     
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  username: {
    color: '#FF6B35',
  },
  status: {
    color: '#6B7280',
    marginTop: 4,
  },
  online: {
    color: '#10B981',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 4,
    fontWeight: '500',
    color: '#374151',
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  metricIcon: {
    padding: 8,
    borderRadius: 8,
  },
  metricFooter: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#F97316',
  },
  metricFooterText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  chip: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 10,
    color: '#991B1B',
  },

  contentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartCard: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chartTabs: {
    flexDirection: 'row',
  },
  chartTab: {
    marginLeft: 12,
  },
  chartTabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartTabActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 3,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBg: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 14,
    color: '#111827',
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
