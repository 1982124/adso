# -*- coding: utf-8 -*-

import json

countries = [
  # ===== AFRICA (16) =====
  {
    "code": "ML", "name": "Mali", "flag": "\U0001F1F2\U0001F1F1",
    "continent": "Afrique", "capital": "Bamako",
    "languages": ["Fran\u00e7ais", "Bambara"],
    "currency": {"code": "XOF", "symbol": "CFA", "name": "Franc CFA (BCEAO)"},
    "drivingSide": "right", "authority": "Direction Nationale de l'Automobile",
    "emergencyPhone": "17 / 15", "minAge": 18,
    "speedUrban": 50, "speedRural": 80, "speedHighway": 100, "bloodAlcohol": 0.8,
    "requiredDocuments": ["Permis de conduire", "Carte grise", "Assurance", "Contr\u00f4le technique"],
    "requiredEquipment": ["Triangle de signalisation", "Gilet de s\u00e9curit\u00e9", "Extincteur", "Trousse de premiers secours"],
    "specialFeatures": ["Priorit\u00e9 \u00e0 droite", "Circulation en convoi possible hors agglom\u00e9ration"],
    "licenseCategories": ["AM", "A1", "A2", "A", "B", "BE", "C1", "C", "CE", "D1", "D", "DE"],
    "commonInfractions": ["Exc\u00e8s de vitesse", "Non-port du gilet", "Non-port du casque", "D\u00e9passement dangereux"],
    "sanctions": ["Amende: 5 000 - 50 000 CFA", "Retrait de points: 1-4 points", "Suspension du permis", "Emprisonnement possible"],
  },
  {
    "code": "SN", "name": "S\u00e9n\u00e9gal", "flag": "\U0001F1F8\U0001F1F3",
    "continent": "Afrique", "capital": "Dakar",
    "languages": ["Fran\u00e7ais", "Wolof"],
    "currency": {"code": "XOF", "symbol": "CFA", "name": "Franc CFA (BCEAO)"},
    "drivingSide": "right", "authority": "Direction de la R\u00e9glementation et de la Circulation Routi\u00e8re",
    "emergencyPhone": "17 / 15", "minAge": 18,
    "speedUrban": 50, "speedRural": 90, "speedHighway": 110, "bloodAlcohol": 0.5,
    "requiredDocuments": ["Permis de conduire", "Carte grise", "Assurance", "Visite technique"],
    "requiredEquipment": ["Triangle de signalisation", "Gilet de s\u00e9curit\u00e9", "Extincteur"],
    "specialFeatures": ["Priorit\u00e9 \u00e0 droite", "Alcool\u00e9mie contr\u00f4l\u00e9e couramment"],
    "licenseCategories": ["AM", "A1", "A2", "A", "B", "BE", "C1", "C", "CE", "D1", "D", "DE"],
    "commonInfractions": ["Exc\u00e8s de vitesse", "Conduite en \u00e9tat d'ivresse", "Non-port de la ceinture", "T\u00e9l\u00e9phone au volant"],
    "sanctions": ["Amende: 10 000 - 100 000 CFA", "Retrait de points", "Suspension du permis: 1-3 mois", "Emprisonnement en cas de r\u00e9cidive"],
  },
]

print(f'{len(countries)} countries')
