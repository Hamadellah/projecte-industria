<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        // 1. Validating les données d'inscription
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        // 2. Création dyal l-user b role 'customer' (Fixe)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'customer', // <--- Dima 'customer' ghir b yeddik (ma-ykunsh admin)
        ]);

        // 3. Générer token Sanctum direct mn ba3d l'inscription (Bash y-t-connecta dghia)
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Retourner la réponse JSON
        return response()->json([
            'message' => 'Compte client créé avec succès',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}