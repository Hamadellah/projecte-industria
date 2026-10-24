<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        // 1. Valider les données
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // 2. Chercher l'utilisateur (Admin wla Client)
        $user = User::where('email', $request->email)->first();

        // 3. Vérifier le mot de passe
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // (M-7din s-str dyal Unauthorized 7it bghina l-client y-dkhl hwa t-an)

        // 4. Générer le token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        // 5. Retourner la réponse m3a l-user w l-role dyalu
        return response()->json([
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // 'admin' wla 'customer'
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}